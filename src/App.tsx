import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { LoadingIndicator } from './components/LoadingIndicator';
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
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <ScrollProgress />
      <LoadingIndicator />
      <Nav />
      <main id="main">
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
