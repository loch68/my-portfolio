import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { SiteBackground } from './components/SiteBackground';
import { ScrollProgress } from './components/ScrollProgress';
import {
  AboutSection,
  ContactSection,
  EducationSection,
  Footer,
  ProjectsSection,
  ServicesSection,
} from './components/Sections';

export default function App() {
  return (
    <>
      <SiteBackground />
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <ScrollProgress />
      <Nav />
      <main id="main" tabIndex={-1}>
        <Hero />
        <ProjectsSection />
        <AboutSection />
        <EducationSection />
        <ServicesSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
