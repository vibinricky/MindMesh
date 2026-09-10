import React from 'react';
import StatCards from '../dashboard/StatCards';

const GlobalMetrics = () => {
  return (
    <div className="container">
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span className="badge lime">[ METRICS & TELEMETRY ]</span>
          <span className="badge">PLATFORM ANALYTICS</span>
        </div>
        <h1 style={{ margin: '0 0 0.5rem 0' }}>
          GLOBAL <span className="lime-accent">METRICS</span>
        </h1>
        <p className="muted" style={{ margin: 0, maxWidth: '600px' }}>
          Platform-wide knowledge base benchmarks, connectivity distribution, and network health indicators.
        </p>
      </div>

      <StatCards />
    </div>
  );
};

export default GlobalMetrics;
