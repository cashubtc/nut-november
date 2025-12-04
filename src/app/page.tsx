import Hero from "./components/Hero";
import About from "./components/About";
import Winners from "./components/Winners";
import Prizes from "./components/Prizes";
import HowToParticipate from "./components/HowToParticipate";
import FAQ from "./components/FAQ";
import Sponsors from "./components/Sponsors";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Winners />
      <Prizes />
      <HowToParticipate />
      <FAQ />
      <Sponsors />
      <Footer />
    </main>
  );
}
