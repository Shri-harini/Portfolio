import VideoIntro from "@/components/VideoIntro";
import AboutStack from "@/components/portfolio/AboutStack";
import PortfolioShell from "@/components/portfolio/PortfolioShell";

export default function Home() {
  return (
    <PortfolioShell>
      <main>
        <VideoIntro nextSectionId="about" />
        <AboutStack />
      </main>
    </PortfolioShell>
  );
}
