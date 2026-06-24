"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import dynamic from "next/dynamic";
import { scrollToSection } from "@/components/portfolio/sections";
import { profile } from "@/data/profile";
import styles from "./VideoIntro.module.css";

const CinematicLayer = dynamic(() => import("./CinematicLayer"), {
  ssr: false,
});

const DESKTOP_VIDEO = "/videos/hero-background.mp4";
const MOBILE_VIDEO = "/videos/portfolio_welcome_video.mp4";
const MOBILE_BREAKPOINT = 768;
const SOUND_HINT_DELAY_MS = 4500;

function pickVideoSrc() {
  if (typeof window === "undefined") return DESKTOP_VIDEO;
  return window.innerWidth <= MOBILE_BREAKPOINT ? MOBILE_VIDEO : DESKTOP_VIDEO;
}

export interface VideoIntroProps {
  nextSectionId?: string;
}

export default function VideoIntro({
  nextSectionId = "about",
}: VideoIntroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const foregroundRef = useRef<HTMLVideoElement>(null);
  const backgroundRef = useRef<HTMLVideoElement>(null);
  const hintRef = useRef<HTMLButtonElement>(null);
  const hintTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoplayBlockedRef = useRef(false);
  const userMutedRef = useRef(false);

  const [mounted, setMounted] = useState(false);
  const [videoSrc, setVideoSrc] = useState(DESKTOP_VIDEO);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setVideoSrc(pickVideoSrc());
    setMounted(true);

    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const onViewportChange = () => setVideoSrc(pickVideoSrc());
    mq.addEventListener("change", onViewportChange);

    return () => mq.removeEventListener("change", onViewportChange);
  }, []);

  const syncVideos = useCallback(() => {
    const fg = foregroundRef.current;
    const bg = backgroundRef.current;
    if (!fg || !bg) return;
    if (Math.abs(bg.currentTime - fg.currentTime) > 0.04) {
      bg.currentTime = fg.currentTime;
    }
  }, []);

  const applyAudioState = useCallback((muted: boolean) => {
    const fg = foregroundRef.current;
    const bg = backgroundRef.current;
    if (!fg || !bg) return;

    fg.muted = muted;
    bg.muted = true;
    bg.volume = 0;
    setIsMuted(muted);
  }, []);

  const waitForVideoReady = (video: HTMLVideoElement) =>
    new Promise<void>((resolve) => {
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        resolve();
        return;
      }

      const onReady = () => {
        video.removeEventListener("loadeddata", onReady);
        resolve();
      };

      video.addEventListener("loadeddata", onReady);
    });

  const handleVideoEnded = useCallback(() => {
    const fg = foregroundRef.current;
    const bg = backgroundRef.current;
    if (!fg || !bg) return;

    fg.pause();
    bg.pause();
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(async () => {
    const fg = foregroundRef.current;
    const bg = backgroundRef.current;
    if (!fg || !bg) return;

    if (fg.paused) {
      if (fg.ended) {
        fg.currentTime = 0;
        bg.currentTime = 0;
      }
      bg.muted = true;
      bg.volume = 0;
      bg.currentTime = fg.currentTime;
      await fg.play();
      await bg.play();
      syncVideos();
      setIsPlaying(true);
    } else {
      fg.pause();
      bg.pause();
      setIsPlaying(false);
    }
  }, [syncVideos]);

  const toggleMute = useCallback(() => {
    const fg = foregroundRef.current;
    if (!fg) return;

    const nextMuted = !fg.muted;
    userMutedRef.current = nextMuted;
    if (!nextMuted) autoplayBlockedRef.current = false;
    applyAudioState(nextMuted);
    setShowHint(false);

    if (!nextMuted && fg.paused && !fg.ended) {
      void fg.play();
      setIsPlaying(true);
    }
  }, [applyAudioState]);

  const enableSound = useCallback(async () => {
    const fg = foregroundRef.current;
    if (!fg || userMutedRef.current) return;

    applyAudioState(false);
    setShowHint(false);
    autoplayBlockedRef.current = false;

    if (fg.paused && !fg.ended) {
      try {
        await fg.play();
        setIsPlaying(true);
      } catch {
        /* keep playing muted if browser still blocks */
      }
    }
  }, [applyAudioState]);

  const startPlayback = useCallback(async () => {
    const fg = foregroundRef.current;
    const bg = backgroundRef.current;
    if (!fg || !bg) return;

    await Promise.all([waitForVideoReady(fg), waitForVideoReady(bg)]);

    fg.pause();
    bg.pause();
    fg.currentTime = 0;
    bg.currentTime = 0;

    bg.muted = true;
    bg.volume = 0;
    fg.muted = false;
    setIsMuted(false);

    try {
      await fg.play();
      bg.currentTime = fg.currentTime;
      await bg.play();
      setIsPlaying(true);
    } catch {
      autoplayBlockedRef.current = true;
      applyAudioState(true);
      setShowHint(true);
      try {
        await fg.play();
        bg.currentTime = fg.currentTime;
        await bg.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    }

    syncVideos();
  }, [applyAudioState, syncVideos]);

  const scrollTo = useCallback((id: string) => {
    scrollToSection(id);
  }, []);

  const handleVideoReady = useCallback(() => {
    setIsLoaded((prev) => prev || true);
  }, []);

  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (!mounted || !videoSrc) return;

    const fg = foregroundRef.current;
    const bg = backgroundRef.current;
    if (!fg || !bg) return;

    let cancelled = false;

    const init = async () => {
      fg.src = videoSrc;
      bg.src = videoSrc;
      fg.load();
      bg.load();

      await startPlayback();
      if (cancelled) return;
    };

    void init();

    const onPlay = () => syncVideos();
    const onTimeUpdate = () => syncVideos();
    const onSeeking = () => syncVideos();
    const onEnded = () => handleVideoEnded();

    fg.addEventListener("play", onPlay);
    fg.addEventListener("timeupdate", onTimeUpdate);
    fg.addEventListener("seeking", onSeeking);
    fg.addEventListener("ended", onEnded);

    return () => {
      cancelled = true;
      fg.removeEventListener("play", onPlay);
      fg.removeEventListener("timeupdate", onTimeUpdate);
      fg.removeEventListener("seeking", onSeeking);
      fg.removeEventListener("ended", onEnded);
      fg.pause();
      bg.pause();
    };
  }, [mounted, videoSrc, syncVideos, handleVideoEnded, startPlayback]);

  useEffect(() => {
    if (!mounted) return;

    const onUserGesture = () => {
      if (!autoplayBlockedRef.current || userMutedRef.current) return;
      void enableSound();
    };

    document.addEventListener("pointerdown", onUserGesture);
    document.addEventListener("keydown", onUserGesture);

    return () => {
      document.removeEventListener("pointerdown", onUserGesture);
      document.removeEventListener("keydown", onUserGesture);
    };
  }, [mounted, enableSound]);

  useEffect(() => {
    if (!mounted || !showHint) return;

    hintTimeoutRef.current = setTimeout(() => setShowHint(false), SOUND_HINT_DELAY_MS);
    return () => {
      if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    };
  }, [mounted, showHint]);

  useEffect(() => {
    if (!mounted) return;

    const fallback = setTimeout(() => setIsLoaded(true), 1200);
    return () => clearTimeout(fallback);
  }, [mounted]);

  useEffect(() => {
    if (!mounted || !isLoaded || !heroRef.current || hasAnimatedRef.current) return;

    hasAnimatedRef.current = true;

    const ctx = gsap.context(() => {
      gsap.set(heroRef.current, { opacity: 0 });
      gsap.set(`.${styles.heroAnim}`, { opacity: 0, y: 28 });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(heroRef.current, { opacity: 1, duration: 1.2, ease: "power2.inOut" })
        .to(
          `.${styles.heroAnim}`,
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 },
          "-=0.7"
        );
    }, heroRef);

    return () => ctx.revert();
  }, [mounted, isLoaded]);

  useEffect(() => {
    if (!hintRef.current) return;

    if (showHint) {
      gsap.fromTo(
        hintRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
      return;
    }

    gsap.to(hintRef.current, {
      opacity: 0,
      y: -6,
      duration: 0.45,
      ease: "power2.in",
    });
  }, [showHint]);

  return (
    <section ref={heroRef} className={styles.hero} aria-label="Introduction">
      <div className={styles.videoStack} aria-hidden="true">
        {mounted && (
          <>
            <video
              ref={backgroundRef}
              className={styles.videoBackground}
              src={videoSrc}
              muted
              playsInline
              preload="auto"
              tabIndex={-1}
              onLoadedData={handleVideoReady}
            />
            <video
              ref={foregroundRef}
              className={styles.videoForeground}
              src={videoSrc}
              playsInline
              preload="auto"
              tabIndex={-1}
              onLoadedData={handleVideoReady}
              onEnded={handleVideoEnded}
            />
          </>
        )}
      </div>

      <div className={styles.gradientOverlay} aria-hidden="true" />
      <div className={styles.warmGlow} aria-hidden="true" />

      {mounted && (
        <div className={styles.particleField} aria-hidden="true">
          <CinematicLayer />
        </div>
      )}

      <div className={styles.heroContent}>
        {profile.openToWork && (
          <div className={`${styles.badge} ${styles.heroAnim}`}>
            <span className={styles.badgeDot} />
            Open to work
          </div>
        )}

        <h1 className={`${styles.name} ${styles.heroAnim}`}>{profile.name}</h1>
        <p className={`${styles.fullName} ${styles.heroAnim}`}>
          {profile.lastName.toUpperCase()}
        </p>
        <p className={`${styles.title} ${styles.heroAnim}`}>{profile.title}</p>

        <div className={`${styles.skillRow} ${styles.heroAnim}`}>
          {profile.heroSkills.map((skill) => (
            <span key={skill} className={styles.skillPill}>
              {skill}
            </span>
          ))}
        </div>

        <div className={`${styles.actions} ${styles.heroAnim}`}>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={() => scrollTo("projects")}
          >
            View Projects
          </button>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubLink}
          >
            GitHub
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M7 17L17 7M17 7H9M17 7V15" />
            </svg>
          </a>
        </div>
      </div>

      {mounted && (
        <div className={styles.videoControls}>
          {showHint && isMuted && (
            <button
              ref={hintRef}
              type="button"
              className={styles.soundHint}
              onClick={enableSound}
              aria-label="Tap for sound"
            >
              <span className={styles.soundHintPulse} />
              Tap anywhere for sound
            </button>
          )}

          <div className={styles.controlGroup}>
            <button
              type="button"
              className={styles.controlBtn}
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              {isPlaying ? (
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l10.5-6.86a1 1 0 0 0 0-1.72L9.5 4.28A1 1 0 0 0 8 5.14z" />
                </svg>
              )}
            </button>
            <button
              type="button"
              className={styles.controlBtn}
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute video" : "Mute video"}
            >
              {isMuted ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                  <path d="M11 5L6 9H3v6h3l5 4V5z" />
                  <line x1="18" y1="9" x2="22" y2="13" />
                  <line x1="22" y1="9" x2="18" y2="13" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                  <path d="M11 5L6 9H3v6h3l5 4V5z" />
                  <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        className={styles.scrollIndicator}
        onClick={() => scrollTo(nextSectionId)}
        aria-label="Scroll to about section"
      >
        <span className={styles.scrollLine} />
        <span className={styles.scrollText}>Scroll</span>
      </button>
    </section>
  );
}
