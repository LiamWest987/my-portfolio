import { Card } from "./ui/card";
import { TrendingUp, Target, Users, BarChart3 } from "lucide-react";

export function About() {
  const values = [
    {
      icon: BarChart3,
      title: "Data-Driven Decisions",
      description: "Leveraging analytics and metrics to drive measurable business outcomes"
    },
    {
      icon: Target,
      title: "Strategic Thinking",
      description: "Aligning operational improvements with organizational goals"
    },
    {
      icon: Users,
      title: "Cross-Functional Leadership",
      description: "Building consensus and driving results across diverse stakeholder groups"
    },
    {
      icon: TrendingUp,
      title: "Continuous Improvement",
      description: "Passionate about optimizing processes and maximizing efficiency"
    }
  ];

  return (
    <section id="about" className="py-20 px-4 bg-secondary/30">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4">About Me</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            I'm an Industrial Engineering student with a focus in Product Management. I combine 
            analytical rigor with strategic thinking to optimize operations, launch successful products, 
            and drive business value. Experienced in Lean Six Sigma, product strategy, and data analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow border-border">
              <value.icon className="h-10 w-10 text-primary mb-4" />
              <h3 className="mb-2">{value.title}</h3>
              <p className="text-muted-foreground text-sm">{value.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
