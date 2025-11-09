import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Project } from "../types/project";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
      onClick={onClick}
    >
      <div className="aspect-video overflow-hidden bg-muted">
        <ImageWithFallback
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <Badge variant="secondary" className="capitalize">
            {project.category}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {formatDate(project.date)}
          </div>
        </div>
        <CardTitle className="group-hover:text-primary transition-colors">
          {project.title}
        </CardTitle>
        <CardDescription>
          {project.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 4).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {project.tags.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{project.tags.length - 4}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button variant="outline" size="sm" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
