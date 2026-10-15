import Hero from "./components/Hero";
import About from "./components/About";
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
      <Prizes />
      <HowToParticipate />
      <FAQ />
      <Sponsors />
      <Footer />
    </main>
  );
}
