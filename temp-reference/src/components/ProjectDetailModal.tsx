import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Github, ExternalLink, FileText, Calendar, Tag } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Project } from "../types/project";

interface ProjectDetailModalProps {
  project: Project | null;
  open: boolean;
  onClose: () => void;
}

export function ProjectDetailModal({ project, open, onClose }: ProjectDetailModalProps) {
  if (!project) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3 mb-2">
            <Badge variant="secondary" className="capitalize">
              {project.category}
            </Badge>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {formatDate(project.date)}
            </div>
          </div>
          <DialogTitle className="text-2xl md:text-3xl">{project.title}</DialogTitle>
          <DialogDescription className="text-base">
            {project.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Project Image */}
          <div className="aspect-video overflow-hidden rounded-lg bg-muted">
            <ImageWithFallback
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {project.githubUrl && (
              <Button asChild>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  View Code
                </a>
              </Button>
            )}
            {project.liveUrl && (
              <Button variant="outline" asChild>
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Live Demo
                </a>
              </Button>
            )}
            {project.pdfUrl && (
              <Button variant="outline" asChild>
                <a href={project.pdfUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4 mr-2" />
                  Download PDF
                </a>
              </Button>
            )}
          </div>

          <Separator />

          {/* Long Description */}
          <div>
            <h3 className="mb-2 flex items-center gap-2">
              <span>Overview</span>
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {project.longDescription}
            </p>
          </div>

          {/* Technologies */}
          <div>
            <h3 className="mb-3 flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Technologies Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <Badge key={index} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Challenges */}
          {project.challenges && (
            <>
              <Separator />
              <div>
                <h3 className="mb-2">Challenges & Solutions</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {project.challenges}
                </p>
              </div>
            </>
          )}

          {/* Outcomes */}
          {project.outcomes && (
            <div>
              <h3 className="mb-2">Outcomes & Impact</h3>
              <p className="text-muted-foreground leading-relaxed">
                {project.outcomes}
              </p>
            </div>
          )}

          {/* Tags */}
          <div>
            <h3 className="mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
