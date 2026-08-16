import Link from 'next/link';

export const metadata = {
  title: 'Page not found',
};

export default function NotFound() {
  return (
    <main style={styles.container}>
      <div style={styles.card}>
        <div style={styles.illustration} aria-hidden>
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 2L2 7v6c0 5 5 9 10 9s10-4 10-9V7l-9-5z" fill="rgba(99,102,241,0.15)"/>
            <path d="M11 2L2 7v6c0 5 5 9 10 9s10-4 10-9V7l-9-5z" stroke="rgba(99,102,241,0.8)" strokeWidth="0.8"/>
            <path d="M9 10h6v1H9z" fill="rgba(99,102,241,0.8)"/>
          </svg>
        </div>

        <h1 style={styles.code}>404</h1>
        <h2 style={styles.title}>Page not found</h2>
        <p style={styles.desc}>
          Sorry — the page you were looking for doesn't exist or has been moved. Try returning to the homepage.
        </p>

        <div style={styles.actions}>
          <Link href="/" style={styles.button} aria-label="Go to home page">
            Go to Home Page
          </Link>
        </div>
      </div>
    </main>
  );
}

const styles: { [k: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(180deg, #F8FAFF 0%, #FFFFFF 60%)',
    padding: '48px 20px',
    color: '#0F172A',
  },
  card: {
    maxWidth: 720,
    width: '100%',
    textAlign: 'center',
    padding: '48px',
    borderRadius: 16,
    boxShadow: '0 10px 30px rgba(2,6,23,0.08)',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(250,250,255,0.75))',
    border: '1px solid rgba(15,23,42,0.04)',
  },
  illustration: {
    marginBottom: 16,
    display: 'flex',
    justifyContent: 'center',
  },
  code: {
    fontSize: 72,
    margin: '8px 0 0 0',
    fontWeight: 700,
    letterSpacing: '-2px',
    color: '#06152B',
  },
  title: {
    fontSize: 22,
    margin: '8px 0 12px 0',
    color: '#0F172A',
    fontWeight: 600,
  },
  desc: {
    margin: '0 auto 24px auto',
    maxWidth: 520,
    color: '#475569',
    lineHeight: 1.6,
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
  },
  button: {
    display: 'inline-block',
    background: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 100%)',
    color: '#fff',
    padding: '12px 20px',
    borderRadius: 10,
    textDecoration: 'none',
    fontWeight: 600,
    boxShadow: '0 6px 18px rgba(99,102,241,0.22)',
    transition: 'transform 150ms ease, box-shadow 150ms ease',
  },
};
