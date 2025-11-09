export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  tags: string[];
  category: "process-improvement" | "product-launch" | "operations" | "supply-chain" | "analytics" | "strategy";
  date: string;
  githubUrl?: string;
  liveUrl?: string;
  pdfUrl?: string;
  featured?: boolean;
  technologies: string[];
  challenges?: string;
  outcomes?: string;
}
