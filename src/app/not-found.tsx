import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="container" style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Page Not Found</h2>
      <p style={{ marginBottom: '2rem', opacity: 0.8 }}>
        Sorry, the page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Button href="/" variant="primary" size="lg">Return Home</Button>
    </div>
  );
}
