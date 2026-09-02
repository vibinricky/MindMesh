import React, { useState } from 'react';
import * as graphService from '../../services/graphService';
import MeshPreview from '../canvas/MeshPreview';

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
      setResults(data.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', color: '#1f2937' }}>Deep Semantic Search</h2>
      <p style={{ color: '#6b7280', marginBottom: '32px' }}>Find non obvious relationships across the entire knowledge network.</p>

      <form onSubmit={handleSearch} style={{ display: 'flex', border: '1px solid #cbd5e1', borderRadius: '8px', backgroundColor: '#fff', marginBottom: '40px', alignItems: 'center' }}>
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder=""
          style={{ flex: 1, padding: '16px 20px', border: 'none', outline: 'none', fontSize: '16px', color: '#111827', background: 'transparent' }}
        />
        <button type="submit" disabled={loading} style={{ margin: '6px', padding: '10px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' }}>
          {loading ? 'Searching...' : 'Deep Scan'}
        </button>
      </form>

      <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#374151', marginBottom: '16px' }}>Search Results ({results.length})</h3>
      <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', marginBottom: '16px' }} />

      {searched && results.length === 0 && !loading && <p style={{ color: '#6b7280' }}>No meshes match your search.</p>}
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {results.map(graph => (
          <div key={graph.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingBottom: '16px' }}>
            <div style={{ fontWeight: 'bold', color: '#111827', fontSize: '16px' }}>{graph.title}</div>
            <div style={{ color: '#6b7280', fontSize: '14px' }}>{graph.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SemanticSearch;
