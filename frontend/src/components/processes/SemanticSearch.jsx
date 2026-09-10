import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as graphService from '../../services/graphService';

const SemanticSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await graphService.searchGraphs(query);
      setResults(data.content || (Array.isArray(data) ? data : []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* EDITORIAL HEADER */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span className="badge lime">[ QUERY ENGINE ]</span>
          <span className="badge">SEMANTIC MATCHING</span>
        </div>
        <h1 style={{ margin: '0 0 0.5rem 0' }}>
          SEMANTIC <span className="lime-accent">GRAPH SEARCH</span>
        </h1>
        <p className="muted" style={{ margin: 0, maxWidth: '620px' }}>
          Query your knowledge network by concept, relationships, or domain keywords.
        </p>
      </div>

      {/* SEARCH INPUT */}
      <form
        onSubmit={handleSearch}
        style={{
          display: 'flex',
          background: 'var(--surface-color)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '0.4rem',
          marginBottom: '2.5rem',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="Search by topic, node concept, or relationship..."
          style={{
            flex: 1,
            padding: '0.85rem 1.25rem',
            border: 'none',
            outline: 'none',
            fontSize: '1rem',
            color: 'var(--text-primary)',
            background: 'transparent',
            boxShadow: 'none'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          className="btn primary"
          style={{ padding: '0.75rem 1.5rem', whiteSpace: 'nowrap' }}
        >
          <span>{loading ? 'Scanning...' : 'Search Graphs'}</span>
          <span>↗</span>
        </button>
      </form>

      {/* RESULTS HEADER */}
      {searched && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '0.75rem'
        }}>
          <h3 style={{ margin: 0 }}>
            Results ({results.length})
          </h3>
          <span className="badge" style={{ fontSize: '0.7rem' }}>
            QUERY: &ldquo;{query}&rdquo;
          </span>
        </div>
      )}

      {searched && results.length === 0 && !loading && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontFamily: 'var(--font-mono)' }}>
            No knowledge graphs matched your search query. Try broader keywords.
          </p>
        </div>
      )}
      
      {/* RESULTS LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {results.map((graph) => (
          <div
            key={graph.id}
            className="card"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div style={{ maxWidth: '75%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <span className="badge" style={{ fontSize: '0.65rem' }}>{graph.domain || 'GENERAL'}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent-color)' }}>
                  COMPLEXITY: {(graph.complexityScore || 0).toFixed(1)}
                </span>
              </div>
              <h3 style={{ margin: '0 0 0.35rem 0', color: 'var(--text-primary)' }}>{graph.title}</h3>
              <p className="muted" style={{ margin: 0, fontSize: '0.875rem' }}>{graph.description || 'No description provided.'}</p>
            </div>

            <Link
              to={`/graphs/${graph.id}/canvas`}
              className="btn primary"
              style={{ padding: '0.5rem 1rem' }}
            >
              <span>Open Canvas</span>
              <span>↗</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SemanticSearch;
