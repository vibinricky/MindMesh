import React, { useState } from 'react';

const EdgeForm = ({ sourceNode, targetNode, onSubmit, onClose }) => {
  const [relationshipType, setRelationshipType] = useState('');
  const [weight, setWeight] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!relationshipType.trim()) return;
    onSubmit({ sourceNodeId: sourceNode.id, targetNodeId: targetNode.id, relationshipType, weight: Number(weight) });
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
        <h3>Connect Nodes</h3>
        <p style={{ fontSize: '12px', color: '#666' }}>
          From: {sourceNode.label} <br/>
          To: {targetNode.label}
        </p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Relationship Type</label>
            <input 
              type="text" 
              value={relationshipType} 
              onChange={(e) => setRelationshipType(e.target.value)} 
              required
              autoFocus
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Weight</label>
            <input type="number" min="0.1" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={onClose} style={{ padding: '5px 10px' }}>Cancel</button>
            <button type="submit" style={{ padding: '5px 10px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}>Connect</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EdgeForm;
