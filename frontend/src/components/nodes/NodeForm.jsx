import React, { useState, useEffect, useRef } from 'react';

const NodeForm = ({ node, onSubmit, onClose }) => {
  const [label, setLabel] = useState('');
  const [type, setType] = useState('Concept');
  const inputRef = useRef(null);

  useEffect(() => {
    if (node) {
      setLabel(node.label || '');
      setType(node.type || 'Concept');
    }
    if (inputRef.current) inputRef.current.focus();
  }, [node]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!label.trim()) return;
    onSubmit({ ...node, label, type });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '360px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.65rem' }}>
          <div>
            <span className="badge lime" style={{ marginBottom: '0.2rem', fontSize: '0.65rem' }}>
              [ CANVAS NODE ]
            </span>
            <h3 style={{ margin: 0, fontSize: '1.15rem' }}>
              {node?.id ? 'Edit Node' : 'Add Node'}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '1.15rem', cursor: 'pointer', padding: 0 }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="nodeLabel" style={{ display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-mono)', fontSize: '0.725rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Node Label *
            </label>
            <input 
              id="nodeLabel"
              ref={inputRef}
              type="text" 
              value={label} 
              onChange={(e) => setLabel(e.target.value)} 
              placeholder="e.g. Neural Cortex"
              required
            />
          </div>

          <div>
            <label htmlFor="nodeType" style={{ display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-mono)', fontSize: '0.725rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Node Classification
            </label>
            <select id="nodeType" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="Concept">Concept</option>
              <option value="Question">Question</option>
              <option value="Evidence">Evidence</option>
              <option value="Outcome">Outcome</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} style={{ background: 'transparent' }}>
              Cancel
            </button>
            <button type="submit" className="btn primary">
              <span>Save Node</span>
              <span>↗</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NodeForm;
