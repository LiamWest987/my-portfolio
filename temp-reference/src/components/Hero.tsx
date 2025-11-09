import { Button } from "./ui/button";
import { Github, Linkedin, Mail, ArrowDown } from "lucide-react";

export function Hero() {
  const scrollToProjects = () => {
    window.location.hash = "#/projects";
  };

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5"></div>
      
      {/* Animated Gradient Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      {/* Grid Texture Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px),
                         linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }}></div>

      {/* Dot Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
        backgroundSize: '30px 30px'
      }}></div>

      <div className="container max-w-5xl mx-auto text-center relative z-10">
        <div className="space-y-6">
          <div className="inline-block">
            <span className="text-primary px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm">
              Product & Operations Portfolio
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl">
            Hi, I'm <span className="text-primary">Your Name</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Industrial Engineer & Product Manager driving{" "}
            <span className="text-accent">measurable business impact</span> through data-driven optimization and strategic execution
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button size="lg" onClick={scrollToProjects}>
              View My Work
              <ArrowDown className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Download Resume
            </Button>
          </div>

          <div className="flex items-center justify-center gap-4 pt-8">
            <Button variant="ghost" size="icon" className="h-10 w-10 hover:text-primary">
              <Github className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 hover:text-primary">
              <Linkedin className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-10 w-10 hover:text-primary">
              <Mail className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
