import React, { useState, useEffect, useRef } from 'react';
import graphService from '../../services/graphService';
import ErrorHandler from '../ErrorHandler';

const GraphForm = ({ graph, onClose }) => {
  const titleRef = useRef(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (graph) {
      setTitle(graph.title || '');
      setDescription(graph.description || '');
      setDomain(graph.domain || '');
      setIsPublic(graph.isPublic || false);
    }
    
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, [graph]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const graphData = { title, description, domain, isPublic };
    
    try {
      if (graph) {
        await graphService.updateGraph(graph.id, graphData);
      } else {
        await graphService.createGraph(graphData);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save graph');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div>
            <span className="badge lime" style={{ marginBottom: '0.25rem' }}>
              {graph ? '[ EDIT GRAPH ]' : '[ NEW GRAPH ]'}
            </span>
            <h3 style={{ margin: 0 }}>
              {graph ? 'Edit Knowledge Mesh' : 'Create Knowledge Mesh'}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '1.25rem', cursor: 'pointer', padding: 0 }}
          >
            ✕
          </button>
        </div>

        <ErrorHandler error={error ? { message: error } : null} />
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="title" style={{ display: 'block', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.725rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Mesh Title *
            </label>
            <input 
              id="title"
              ref={titleRef}
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g. Cognitive Systems Architecture"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" style={{ display: 'block', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.725rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Description
            </label>
            <textarea 
              id="description"
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Brief summary of nodes and relationships..."
              style={{ minHeight: '80px', resize: 'vertical' }}
            />
          </div>
          
          <div>
            <label htmlFor="domain" style={{ display: 'block', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.725rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Domain / Subject
            </label>
            <input 
              id="domain"
              type="text" 
              value={domain} 
              onChange={(e) => setDomain(e.target.value)} 
              placeholder="e.g. Neuroscience, Economics, ML"
            />
          </div>
          
          <div style={{
            background: 'var(--surface-color-elevated)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            marginTop: '0.25rem'
          }}>
            <label htmlFor="isPublic" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', margin: 0 }}>
              <input 
                id="isPublic"
                type="checkbox" 
                checked={isPublic} 
                onChange={(e) => setIsPublic(e.target.checked)} 
                style={{ width: '16px', height: '16px', accentColor: 'var(--accent-color)' }}
              />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                Make this knowledge mesh public in Discovery
              </span>
            </label>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" onClick={onClose} style={{ background: 'transparent' }}>
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="btn primary">
              <span>{isLoading ? 'Saving...' : (graph ? 'Update Mesh' : 'Create Mesh')}</span>
              <span>↗</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GraphForm;
