import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Insights } from "@/components/Insights";
import { Navbar } from "@/components/Navbar";
import { PracticeAreas } from "@/components/PracticeAreas";
import { Statement } from "@/components/Statement";
import { Team } from "@/components/Team";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Statement />
        <PracticeAreas />
        <Team />
        <Insights />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
