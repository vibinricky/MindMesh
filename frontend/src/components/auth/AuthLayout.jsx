import React from 'react';
import { Link } from 'react-router-dom';
import './auth.css';

// Procedural dot columns representing graph node connectivity
const GRAPH_DOT_COLUMNS = [
  [1, 1, 0, 0, 0],
  [1, 1, 1, 0, 0],
  [1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 0, 0],
  [1, 1, 0, 0, 0],
  [1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 0, 0],
  [1, 1, 0, 0, 0],
  [1, 1, 1, 0, 0],
  [1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1],
  [1, 1, 1, 1, 0],
  [1, 1, 0, 0, 0],
  [1, 1, 1, 0, 0],
  [1, 1, 1, 1, 0],
  [1, 1, 0, 0, 0],
];

const AuthLayout = ({
  mode = 'login', // 'login' | 'register'
  heroBadge = 'KNOWLEDGE MESH',
  heroTitleLine1 = 'NETWORK GRAPHS &',
  heroTitleHighlight = 'KNOWLEDGE',
  heroTitleLine2 = 'BASES.',
  heroDescription = 'Map interconnected information, analyze semantic relationships, and visualize complex graphs in real-time.',
  cardTag = 'GRAPH OVERVIEW',
  metric1Value = '1,240+',
  metric1Label = 'CONNECTED NODES',
  metric2Value = '98.6%',
  metric2Label = 'SEMANTIC RELEVANCE',
  cardFooter = 'INTERACTIVE CANVAS • REAL-TIME SYNC',
  specs = [
    { key: 'PLATFORM', val: 'MINDMESH WEB' },
    { key: 'WORKSPACE', val: 'KNOWLEDGE GRAPH' },
    { key: 'VERSION', val: '2.0' },
  ],
  children,
}) => {
  const isLogin = mode === 'login';

  return (
    <div className="y2k-auth-viewport">
      <div className="y2k-auth-content">
        {/* TOP NAVIGATION */}
        <header className="y2k-topbar">
          <div className="y2k-brand-wrapper">
            <Link to="/" className="y2k-brand-logo">
              <div className="y2k-logo-icon">M</div>
              <span className="y2k-brand-name">MINDMESH</span>
            </Link>
          </div>

          <div className="y2k-topbar-hud">
            <span className="y2k-app-tag">Network Graphs & Knowledge Bases</span>
            <Link
              to={isLogin ? '/register' : '/login'}
              className="y2k-nav-link-badge"
            >
              <span>{isLogin ? 'Create Account' : 'Log In'}</span>
              <span style={{ color: 'var(--y2k-lime)' }}>↗</span>
            </Link>
          </div>
        </header>

        {/* MAIN ASYMMETRIC GRID */}
        <main className="y2k-auth-main">
          {/* LEFT COLUMN: HERO & VISUAL SHOWCASE */}
          <section className="y2k-hero-pane">
            <div className="y2k-hero-top">
              <div className="y2k-meta-row">
                <span className="y2k-meta-badge highlight">{heroBadge}</span>
                <span className="y2k-meta-badge">MINDMESH 2.0</span>
                <span className="y2k-meta-badge" style={{ letterSpacing: '0.08em' }}>[ GRAPH CANVAS ]</span>
              </div>

              <h1 className="y2k-hero-title">
                {heroTitleLine1}{' '}
                <span className="lime-accent">{heroTitleHighlight}</span>{' '}
                {heroTitleLine2}
              </h1>

              <p className="y2k-hero-desc">
                {heroDescription}
              </p>

              {/* NEON LIME FEATURE CARD */}
              <div className="y2k-telemetry-card">
                <div className="y2k-telemetry-header">
                  <span className="y2k-telemetry-label">{cardTag}</span>
                  <div className="y2k-hazard-stripes" />
                </div>

                <div className="y2k-telemetry-metrics">
                  <div className="y2k-metric-item">
                    <span className="y2k-metric-value">{metric1Value}</span>
                    <span className="y2k-metric-title">{metric1Label}</span>
                  </div>
                  <div className="y2k-metric-item">
                    <span className="y2k-metric-value">{metric2Value}</span>
                    <span className="y2k-metric-title">{metric2Label}</span>
                  </div>
                </div>

                {/* GRAPH DENSITY DOT MATRIX */}
                <div className="y2k-dot-matrix-container">
                  {GRAPH_DOT_COLUMNS.map((col, colIdx) => (
                    <div key={colIdx} className="y2k-dot-column">
                      {col.map((dotActive, dotIdx) => (
                        <div
                          key={dotIdx}
                          className={`y2k-matrix-dot ${dotActive ? 'active' : ''}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                <div className="y2k-telemetry-footer">
                  <span>{cardFooter}</span>
                  <span>MINDMESH</span>
                </div>
              </div>
            </div>

            {/* BOTTOM DETAILS */}
            <div className="y2k-hero-bottom">
              <div className="y2k-specs-grid">
                {specs.map((item, idx) => (
                  <div key={idx} className="y2k-spec-line">
                    <span className="y2k-spec-key">{item.key}:</span>
                    <span className="y2k-spec-val">{item.val}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontFamily: 'var(--y2k-font-mono)', fontSize: '0.7rem', color: 'var(--y2k-gray-500)' }}>
                MINDMESH // 2026
              </div>
            </div>
          </section>

          {/* RIGHT COLUMN: FORM TERMINAL */}
          <section className="y2k-terminal-pane">
            <div className="y2k-terminal-card">
              {children}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;
