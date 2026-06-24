"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./VideoIntro.module.css";

const PARTICLE_COUNT = 120;
const PARALLAX_STRENGTH = 0.35;

function createSoftParticleTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.25, "rgba(255,255,255,0.6)");
    gradient.addColorStop(0.55, "rgba(255,255,255,0.15)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function CinematicLayer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 70 : PARTICLE_COUNT;

    const positions = new Float32Array(count * 3);
    const basePositions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const speeds = new Float32Array(count);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    const warmOrange = new THREE.Color("#ff8c42");
    const softWhite = new THREE.Color("#fff5eb");
    const monitorBlue = new THREE.Color("#6eb5ff");

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = (Math.random() - 0.5) * 14;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 6 - 1;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
      basePositions[i3] = x;
      basePositions[i3 + 1] = y;
      basePositions[i3 + 2] = z;

      phases[i] = Math.random() * Math.PI * 2;
      speeds[i] = 0.15 + Math.random() * 0.35;
      sizes[i] = 0.08 + Math.random() * 0.22;

      const paletteRoll = Math.random();
      const color =
        paletteRoll > 0.72
          ? monitorBlue
          : paletteRoll > 0.35
            ? warmOrange
            : softWhite;
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const particleTexture = createSoftParticleTexture();

    const material = new THREE.PointsMaterial({
      map: particleTexture,
      size: isMobile ? 0.55 : 0.75,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const mouse = { x: 0, y: 0 };
    const targetCamera = { x: 0, y: 0 };

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!event.touches[0]) return;
      mouse.x = (event.touches[0].clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (event.touches[0].clientY / window.innerHeight - 0.5) * 2;
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("resize", onResize);

    const positionAttr = geometry.getAttribute("position") as THREE.BufferAttribute;
    const clock = new THREE.Clock();

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      targetCamera.x += (mouse.x * PARALLAX_STRENGTH - targetCamera.x) * 0.04;
      targetCamera.y += (-mouse.y * PARALLAX_STRENGTH - targetCamera.y) * 0.04;
      camera.position.x = targetCamera.x;
      camera.position.y = targetCamera.y;
      camera.lookAt(0, 0, 0);

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const phase = phases[i];
        const speed = speeds[i];

        positionAttr.array[i3] =
          basePositions[i3] + Math.sin(elapsed * speed + phase) * 0.18;
        positionAttr.array[i3 + 1] =
          basePositions[i3 + 1] +
          Math.cos(elapsed * speed * 0.7 + phase) * 0.22;
        positionAttr.array[i3 + 2] =
          basePositions[i3 + 2] +
          Math.sin(elapsed * speed * 0.5 + phase * 1.3) * 0.12;
      }
      positionAttr.needsUpdate = true;

      particles.rotation.y = Math.sin(elapsed * 0.08) * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      particleTexture.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={styles.cinematicLayer}
      aria-hidden="true"
    />
  );
}
