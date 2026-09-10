import React, { useEffect, useState } from 'react';
import * as graphService from '../../services/graphService';

const StatCards = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    graphService.getPlatformStats().then(setStats).catch(console.error);
  }, []);

  if (!stats) {
    return (
      <div style={{ padding: '2rem 0', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>
        Loading platform statistics...
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2.5rem'
    }}>
      {/* HIGHLIGHT CARD (NEON LIME) */}
      <div style={{
        background: 'var(--accent-color)',
        color: '#000000',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lime)',
        minHeight: '160px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.725rem',
            fontWeight: '700',
            letterSpacing: '0.06em',
            textTransform: 'uppercase'
          }}>
            TOTAL KNOWLEDGE MESHES
          </span>
          <div style={{
            width: '44px',
            height: '12px',
            background: 'repeating-linear-gradient(-45deg, #000, #000 3px, var(--accent-color) 3px, var(--accent-color) 6px)',
            border: '1px solid #000',
            borderRadius: '2px'
          }} />
        </div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '3rem',
          fontWeight: '800',
          lineHeight: '1',
          letterSpacing: '-0.03em'
        }}>
          {stats.totalGraphs || stats.totalNodes || 0}
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          marginTop: '0.75rem',
          letterSpacing: '0.04em'
        }}>
          ACTIVE NETWORK GRAPHS
        </div>
      </div>

      {/* STAT CARD 2: PUBLIC REACH */}
      <div style={{
        background: 'var(--surface-color)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        minHeight: '160px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.725rem',
            fontWeight: '700',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)'
          }}>
            PUBLIC REACH
          </span>
          <span className="badge lime" style={{ fontSize: '0.65rem' }}>PUBLISHED</span>
        </div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '3rem',
          fontWeight: '800',
          lineHeight: '1',
          letterSpacing: '-0.03em',
          color: 'var(--text-primary)'
        }}>
          {stats.publicReach || 0}
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          marginTop: '0.75rem',
          letterSpacing: '0.04em'
        }}>
          PUBLICLY DISCOVERABLE MESHES
        </div>
      </div>

      {/* STAT CARD 3: REGISTERED ARCHITECTS */}
      <div style={{
        background: 'var(--surface-color)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        minHeight: '160px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.725rem',
            fontWeight: '700',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)'
          }}>
            REGISTERED RESEARCHERS
          </span>
          <span className="badge" style={{ fontSize: '0.65rem' }}>VERIFIED</span>
        </div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '3rem',
          fontWeight: '800',
          lineHeight: '1',
          letterSpacing: '-0.03em',
          color: 'var(--text-primary)'
        }}>
          {stats.registeredUsers || 4}
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          marginTop: '0.75rem',
          letterSpacing: '0.04em'
        }}>
          COLLABORATIVE ACCOUNTS
        </div>
      </div>
    </div>
  );
};

export default StatCards;
