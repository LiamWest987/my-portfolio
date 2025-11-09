import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";

export function Header() {
  const [isDark, setIsDark] = useState(false);
  const [currentHash, setCurrentHash] = useState(window.location.hash || "#/");

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }

    // Listen for hash changes
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || "#/");
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  const isActive = (path: string) => {
    if (path === "#/") {
      return currentHash === "#/" || currentHash === "";
    }
    return currentHash === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-8">
        <a
          href="#/"
          className="transition-colors hover:text-primary"
        >
          <span className="text-primary">{"<"}</span>
          Portfolio
          <span className="text-accent">{" />"}</span>
        </a>

        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#/"
            className={`transition-colors hover:text-primary ${isActive("#/") ? "text-primary" : ""}`}
          >
            Home
          </a>
          <a
            href="#/projects"
            className={`transition-colors hover:text-primary ${isActive("#/projects") ? "text-primary" : ""}`}
          >
            Projects
          </a>
          <a
            href="#/about"
            className={`transition-colors hover:text-primary ${isActive("#/about") ? "text-primary" : ""}`}
          >
            About & Skills
          </a>
          <a
            href="#/contact"
            className={`transition-colors hover:text-primary ${isActive("#/contact") ? "text-primary" : ""}`}
          >
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  );
}
