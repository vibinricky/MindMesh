import React, { useState } from 'react';

const EdgeForm = ({ sourceNode, targetNode, onSubmit, onClose }) => {
  const [relationshipType, setRelationshipType] = useState('');
  const [weight, setWeight] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!relationshipType.trim()) return;
    onSubmit({ sourceNodeId: sourceNode.id, targetNodeId: targetNode.id, relationshipType, weight: Number(weight) });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '380px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.65rem' }}>
          <div>
            <span className="badge lime" style={{ marginBottom: '0.2rem', fontSize: '0.65rem' }}>
              [ CONNECTIVITY ]
            </span>
            <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Connect Nodes</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '1.15rem', cursor: 'pointer', padding: 0 }}
          >
            ✕
          </button>
        </div>

        <div style={{
          background: 'var(--surface-color-elevated)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem',
          marginBottom: '1rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: 'var(--text-secondary)'
        }}>
          <div>FROM: <strong style={{ color: 'var(--text-primary)' }}>{sourceNode.label}</strong></div>
          <div style={{ marginTop: '0.25rem' }}>TO: <strong style={{ color: 'var(--accent-color)' }}>{targetNode.label}</strong></div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="relationshipType" style={{ display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-mono)', fontSize: '0.725rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Relationship Type *
            </label>
            <input 
              id="relationshipType"
              type="text" 
              value={relationshipType} 
              onChange={(e) => setRelationshipType(e.target.value)} 
              placeholder="e.g. INFLUENCES, LEADS_TO"
              required
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="weight" style={{ display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-mono)', fontSize: '0.725rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Connection Weight
            </label>
            <input 
              id="weight" 
              type="number" 
              min="0.1" 
              step="0.1" 
              value={weight} 
              onChange={(e) => setWeight(e.target.value)} 
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} style={{ background: 'transparent' }}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              <span>Connect Nodes</span>
              <span>↗</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EdgeForm;
