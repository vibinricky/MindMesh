import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { createGraph, updateGraph } from '../../store/slices/graphSlice';
import ErrorHandler from '../ErrorHandler';

const GraphForm = ({ graph, onClose }) => {
  const dispatch = useDispatch();
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
      let resultAction;
      if (graph) {
        resultAction = await dispatch(updateGraph({ id: graph.id, graphData }));
      } else {
        resultAction = await dispatch(createGraph(graphData));
      }
      
      if (resultAction.error) {
        setError(resultAction.payload || 'Failed to save graph');
      } else {
        alert(`KnowledgeGraph ${graph ? 'updated' : 'created'} successfully.`);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const modalStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000
  };

  const contentStyle = {
    background: '#fff', padding: '20px', borderRadius: '8px',
    width: '100%', maxWidth: '500px'
  };

  return (
    <div style={modalStyle}>
      <div style={contentStyle}>
        <h2>{graph ? 'Edit Mesh' : 'Create New Mesh'}</h2>
        <ErrorHandler error={error ? { message: error } : null} />
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="title" style={{ display: 'block', marginBottom: '5px' }}>Mesh Title</label>
            <input 
              id="title"
              ref={titleRef}
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="description" style={{ display: 'block', marginBottom: '5px' }}>Description</label>
            <textarea 
              id="description"
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', minHeight: '80px' }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="domain" style={{ display: 'block', marginBottom: '5px' }}>Domain</label>
            <input 
              id="domain"
              type="text" 
              value={domain} 
              onChange={(e) => setDomain(e.target.value)} 
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="isPublic" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                id="isPublic"
                type="checkbox" 
                checked={isPublic} 
                onChange={(e) => setIsPublic(e.target.checked)} 
              />
              Visibility toggle (Make this mesh public)
            </label>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={onClose} style={{ padding: '8px 16px' }}>Cancel</button>
            <button type="submit" disabled={isLoading} style={{ padding: '8px 16px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}>
              {isLoading ? 'Saving...' : (graph ? 'Update Mesh' : 'Build Mesh')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GraphForm;
