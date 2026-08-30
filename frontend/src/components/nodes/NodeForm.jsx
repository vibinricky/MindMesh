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

  const modalStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000
  };

  const contentStyle = {
    background: '#fff', padding: '20px', borderRadius: '8px',
    width: '100%', maxWidth: '300px'
  };

  return (
    <div style={modalStyle}>
      <div style={contentStyle}>
        <h3>{node ? 'Edit Node' : 'Add Node'}</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="nodeLabel" style={{ display: 'block', marginBottom: '5px' }}>Label</label>
            <input 
              id="nodeLabel"
              ref={inputRef}
              type="text" 
              value={label} 
              onChange={(e) => setLabel(e.target.value)} 
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="nodeType" style={{ display: 'block', marginBottom: '5px' }}>Node Type</label>
            <select id="nodeType" value={type} onChange={(e) => setType(e.target.value)} style={{ width: '100%', padding: '8px' }}>
              <option>Concept</option><option>Question</option><option>Evidence</option><option>Outcome</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={onClose} style={{ padding: '5px 10px' }}>Cancel</button>
            <button type="submit" style={{ padding: '5px 10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NodeForm;
