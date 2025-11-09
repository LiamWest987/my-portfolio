import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { FeaturedProjects } from "../components/FeaturedProjects";

export function HomePage() {
  return (
    <div>
      <Hero />
      <About />
      <FeaturedProjects />
    </div>
  );
}
