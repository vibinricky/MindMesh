import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyGraphs, deleteGraph } from '../../store/slices/graphSlice';
import MeshPreview from '../canvas/MeshPreview';
import EmptyState from '../common/EmptyState';
import ErrorHandler from '../ErrorHandler';
import GraphForm from './GraphForm';

const GraphList = ({ type }) => {
  const dispatch = useDispatch();
  const { items, loading, error, currentPage, totalPages } = useSelector((state) => state.graphs);
  const { user } = useSelector((state) => state.auth);
  
  const [showForm, setShowForm] = useState(false);
  const [editingGraph, setEditingGraph] = useState(null);

  useEffect(() => {
    if (type === 'my') {
      dispatch(fetchMyGraphs({ page: 0, size: 10 }));
    }
  }, [dispatch, type]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      dispatch(fetchMyGraphs({ page: newPage, size: 10 }));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this knowledge graph?')) {
      dispatch(deleteGraph(id));
    }
  };

  const handleEdit = (graph) => {
    setEditingGraph(graph);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingGraph(null);
  };

  const isStrategist = user?.role === 'ROLE_RESEARCH_STRATEGIST';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>My Knowledge Meshes</h2>
        {isStrategist && (
          <button onClick={() => setShowForm(true)} style={{ padding: '8px 16px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            + Create New Mesh
          </button>
        )}
      </div>

      <ErrorHandler error={error ? { message: error } : null} onRetry={() => dispatch(fetchMyGraphs({ page: currentPage, size: 10 }))} />

      {loading && <p>Loading meshes...</p>}

      {!loading && items.length === 0 && !error && (
        <EmptyState 
          message="You haven't built any interactive graphs yet" 
          action={isStrategist && (
            <button onClick={() => setShowForm(true)} style={{ padding: '8px 16px', cursor: 'pointer' }}>
              Create your first mesh
            </button>
          )} 
        />
      )}

      {!loading && items.length > 0 && (
        <div>
          {items.map(graph => (
            <MeshPreview 
              key={graph.id} 
              graph={graph} 
              showActions={isStrategist && graph.ownerId === user?.id}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
          
          {totalPages > 1 && (
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'center' }}>
              <button disabled={currentPage === 0} onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
              <span>Page {currentPage + 1} of {totalPages}</span>
              <button disabled={currentPage === totalPages - 1} onClick={() => handlePageChange(currentPage + 1)}>Next</button>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <GraphForm 
          graph={editingGraph} 
          onClose={closeForm} 
        />
      )}
    </div>
  );
};

export default GraphList;
