'use client';

import { colors, typography, spacing } from './theme';

export default function Home() {
  return (
    <main style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.heading}>DESKIT</h1>
        <p style={styles.subtitle}>Precision-engineered desk tools.</p>
      </div>
    </main>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: colors.primary,
    color: colors.secondary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[8],
  },
  hero: {
    textAlign: 'center',
  },
  heading: {
    fontSize: typography.fontSize['5xl'],
    fontFamily: typography.fontFamily.display,
    marginBottom: spacing[4],
    letterSpacing: '0.1em',
  },
  subtitle: {
    fontSize: typography.fontSize.lg,
    color: colors.accent,
    fontFamily: typography.fontFamily.body,
  },
};
