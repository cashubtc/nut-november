import Hero from "./components/Hero";
import About from "./components/About";
import Prizes from "./components/Prizes";
import HowToParticipate from "./components/HowToParticipate";
import BuilderShowcase from "./components/BuilderShowcase";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Prizes />
      <HowToParticipate />
      <BuilderShowcase />
      <FAQ />
      <Footer />
    </main>
  );
}
