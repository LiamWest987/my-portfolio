export function Footer() {
  return (
    <footer className="border-t py-8 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © 2024 Your Name. Built with React & Tailwind CSS
          </p>
          <p className="text-sm text-muted-foreground text-center md:text-right">
            <span className="text-primary">Driven by</span>{" "}
            <span className="text-accent">data</span> and results
          </p>
        </div>
      </div>
    </footer>
  );
}
