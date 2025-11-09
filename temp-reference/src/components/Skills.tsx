import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { GraduationCap, Briefcase, Award } from "lucide-react";

export function Skills() {
  const technicalSkills = {
    "Product Management": ["Product Strategy", "Roadmapping", "User Research", "A/B Testing", "Agile/Scrum", "OKRs"],
    "Process Improvement": ["Lean Manufacturing", "Six Sigma (Green Belt)", "Value Stream Mapping", "Kaizen", "5S", "Root Cause Analysis"],
    "Data & Analytics": ["SQL", "Python", "Tableau", "Power BI", "Excel (Advanced)", "Statistical Analysis"],
    "Operations & Supply Chain": ["Inventory Management", "Logistics", "Forecasting", "Capacity Planning", "Network Optimization"],
    "Engineering Tools": ["Minitab", "Arena Simulation", "AutoCAD", "Microsoft Visio", "Process Mapping"],
    "Business Tools": ["Jira", "Confluence", "Google Analytics", "Figma", "Miro", "Productboard"]
  };

  const education = [
    {
      degree: "B.S. Industrial Engineering",
      school: "Your University Name",
      year: "Expected 2026",
      description: "Focus in Product Management • GPA: 3.8 • Relevant coursework: Operations Research, Supply Chain Management, Quality Engineering, Data Analytics"
    },
    {
      degree: "Certifications",
      school: "Various Institutions",
      year: "2023-2024",
      description: "Lean Six Sigma Green Belt • Certified Scrum Product Owner (CSPO) • Google Data Analytics Certificate"
    }
  ];

  const experience = [
    {
      role: "Product Management Intern",
      company: "Tech Company",
      period: "Summer 2024",
      description: "Conducted user research with 50+ customers, prioritized product backlog, and launched 3 features that increased engagement by 25%"
    },
    {
      role: "Operations Analyst Intern",
      company: "Manufacturing Company",
      period: "Summer 2023",
      description: "Led Lean Six Sigma project reducing defect rate by 32%, created process documentation, and trained 20+ employees on new procedures"
    },
    {
      role: "Student Consultant",
      company: "University Consulting Program",
      period: "2023-Present",
      description: "Partner with local businesses on process improvement and strategy projects, delivering data-driven recommendations"
    }
  ];

  const achievements = [
    "Lean Six Sigma Green Belt Certification - Achieved 35% cycle time reduction in capstone project",
    "Dean's List - 4 consecutive semesters",
    "1st Place - University Case Competition on Supply Chain Optimization",
    "President - Industrial & Systems Engineering Student Association",
    "Published case study on process improvement in student research journal"
  ];

  return (
    <section id="skills" className="py-20 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4">Skills & Experience</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Combining analytical expertise with strategic product thinking to deliver business value
          </p>
        </div>

        <Tabs defaultValue="skills" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8">
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="achievements">Awards</TabsTrigger>
          </TabsList>

          <TabsContent value="skills" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(technicalSkills).map(([category, skills]) => (
                <Card key={category} className="p-6">
                  <h3 className="mb-4 text-primary">{category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="education" className="mt-0">
            <div className="space-y-6 max-w-3xl mx-auto">
              {education.map((edu, index) => (
                <Card key={index} className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <GraduationCap className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3>{edu.degree}</h3>
                          <p className="text-muted-foreground">{edu.school}</p>
                        </div>
                        <Badge>{edu.year}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{edu.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="experience" className="mt-0">
            <div className="space-y-6 max-w-3xl mx-auto">
              {experience.map((exp, index) => (
                <Card key={index} className="p-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                        <Briefcase className="h-6 w-6 text-accent" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3>{exp.role}</h3>
                          <p className="text-muted-foreground">{exp.company}</p>
                        </div>
                        <Badge variant="outline">{exp.period}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{exp.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="mt-0">
            <div className="max-w-3xl mx-auto">
              <Card className="p-6">
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex gap-4 items-start">
                      <div className="flex-shrink-0 mt-1">
                        <Award className="h-5 w-5 text-accent" />
                      </div>
                      <p>{achievement}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
