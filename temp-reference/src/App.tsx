import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    // Function to handle route changes
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || "/";
      setCurrentPage(hash);
    };

    // Set initial page
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // Render the appropriate page based on route
  const renderPage = () => {
    switch (currentPage) {
      case "/":
        return <HomePage />;
      case "/projects":
        return <ProjectsPage />;
      case "/about":
        return <AboutPage />;
      case "/contact":
        return <ContactPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>{renderPage()}</main>
      <Footer />
    </div>
  );
}
