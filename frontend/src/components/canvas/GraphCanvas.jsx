import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as graphService from '../../services/graphService';
import NodeElement from './NodeElement';
import EdgeElement from './EdgeElement';
import NodeForm from '../nodes/NodeForm';
import EdgeForm from './EdgeForm';
import ErrorHandler from '../ErrorHandler';
import CapacityBar from '../common/CapacityBar';

const GraphCanvas = () => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [graph, setGraph] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nodeForm, setNodeForm] = useState(null);
  const [clickPos, setClickPos] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState(null);
  const [edgeSource, setEdgeSource] = useState(null);
  const [edgeTarget, setEdgeTarget] = useState(null);
  const [showInsights, setShowInsights] = useState(false);
  const [inviteeUsername, setInviteeUsername] = useState('');
  const [message, setMessage] = useState('');
  const [dragging, setDragging] = useState(null);
  const canEdit = user?.role === 'ROLE_RESEARCH_STRATEGIST' && graph?.ownerId === user?.id;

  const loadData = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const data = await graphService.getFullGraph(id);
      setGraph(data); setNodes(data.nodes || []); setEdges(data.edges || []);
    } catch (err) { setError(err.response?.data?.message || 'Failed to load this mesh'); }
    finally { setLoading(false); }
  }, [id]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleCanvasClick = (event) => {
    if (!canEdit) return;
    if (edgeSource) { setEdgeSource(null); setMessage('Connection cancelled.'); return; }
    const rect = event.currentTarget.getBoundingClientRect();
    setClickPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    setNodeForm({});
  };
  const handleNodeClick = (node) => {
    if (!canEdit) return;
    if (edgeSource) {
      if (edgeSource.id === node.id) { setEdgeSource(null); return; }
      setEdgeTarget(node); return;
    }
    setSelected(node); setNodeForm(node);
  };
  const saveNode = async (form) => {
    try {
      const payload = { label: form.label, type: form.type, xPosition: nodeForm?.id ? nodeForm.xPosition : clickPos.x, yPosition: nodeForm?.id ? nodeForm.yPosition : clickPos.y };
      const saved = nodeForm?.id ? await graphService.updateNode(nodeForm.id, payload) : await graphService.addNodes(id, payload);
      setNodes((current) => nodeForm?.id ? current.map((node) => node.id === saved.id ? saved : node) : [...current, saved]);
      setNodeForm(null); setSelected(saved); setMessage('Node saved.');
    } catch (err) { setError(err.response?.data?.message || 'Unable to save node'); }
  };
  const removeNode = async () => {
    if (!selected || !window.confirm(`Delete “${selected.label}” and its connections?`)) return;
    try { await graphService.deleteNode(selected.id); setNodes((items) => items.filter((node) => node.id !== selected.id)); setEdges((items) => items.filter((edge) => edge.sourceNodeId !== selected.id && edge.targetNodeId !== selected.id)); setSelected(null); setNodeForm(null); setMessage('Node deleted.'); }
    catch (err) { setError(err.response?.data?.message || 'Unable to delete node'); }
  };
  const saveEdge = async (form) => {
    try { const saved = await graphService.createEdge({ ...form, graphId: Number(id) }); setEdges((items) => [...items, saved]); setEdgeSource(null); setEdgeTarget(null); setMessage('Connection created.'); }
    catch (err) { setError(err.response?.data?.message || 'Unable to create connection'); }
  };
  const removeEdge = async (edgeId) => {
    if (!canEdit || !window.confirm('Delete this connection?')) return;
    try { await graphService.deleteEdge(edgeId); setEdges((items) => items.filter((edge) => edge.id !== edgeId)); }
    catch (err) { setError(err.response?.data?.message || 'Unable to delete connection'); }
  };
  const calculate = async () => { try { const updated = await graphService.calculateComplexity(id); setGraph((current) => ({ ...current, complexityScore: updated.complexityScore })); } catch { setError('Unable to calculate complexity'); } };
  const invite = async (event) => { event.preventDefault(); try { await graphService.inviteCollaborator(Number(id), inviteeUsername); setInviteeUsername(''); setMessage('Invitation sent.'); } catch (err) { setError(err.response?.data?.message || 'Unable to send invitation'); } };
  const moveNode = (event) => {
    if (!dragging || !canEdit) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const xPosition = event.clientX - rect.left; const yPosition = event.clientY - rect.top;
    setNodes((current) => current.map((node) => node.id === dragging.id ? { ...node, xPosition, yPosition } : node));
  };
  const finishMove = async () => {
    if (!dragging) return;
    const moved = nodes.find((node) => node.id === dragging.id); setDragging(null);
    if (!moved) return;
    try { await graphService.updateNode(moved.id, moved); } catch (err) { setError(err.response?.data?.message || 'Unable to save node position'); loadData(); }
  };

  if (loading) return <p>Loading canvas...</p>;
  if (error && !graph) return <ErrorHandler error={{ message: error }} onRetry={loadData} />;
  return <div>
    <ErrorHandler error={error ? { message: error } : null} onRetry={loadData} />
    {message && <p style={{ color: '#18794e' }}>{message}</p>}
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'start', marginBottom: 14 }}>
      <div><h2 style={{ marginBottom: 4 }}>{graph.title}</h2><p>{graph.description}</p></div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button onClick={() => setShowInsights(true)}>View Insights</button>
        {canEdit && <><button onClick={() => { setEdgeSource(null); setSelected(null); setClickPos({ x: 300, y: 220 }); setNodeForm({}); }}>Add Node</button><button onClick={() => { setEdgeSource({ selecting: true }); setMessage('Choose a source node.'); }}>Connect Nodes</button><button onClick={calculate}>Calculate Complexity</button></>}
      </div>
    </div>
    {canEdit && <form onSubmit={invite} style={{ marginBottom: 12 }}><label>Invite collaborator: <input value={inviteeUsername} onChange={(e) => setInviteeUsername(e.target.value)} placeholder="Username" required /></label> <button>Send invite</button></form>}
    {edgeSource && <p style={{ background: '#e9f4ff', padding: 8 }}>Connection mode: {edgeSource.selecting ? 'click a source node' : `select a node to connect from ${edgeSource.label}`}. Click empty canvas to cancel.</p>}
    <div style={{ height: 600, border: '1px solid #cbd5e1', background: '#f8fafc' }}><svg width="100%" height="100%" onClick={handleCanvasClick} onMouseMove={moveNode} onMouseUp={finishMove} onMouseLeave={finishMove}>
      {edges.map((edge) => <g key={edge.id} onDoubleClick={(event) => { event.stopPropagation(); removeEdge(edge.id); }}><EdgeElement edge={edge} sourceNode={nodes.find((node) => node.id === edge.sourceNodeId)} targetNode={nodes.find((node) => node.id === edge.targetNodeId)} /></g>)}
      {nodes.map((node) => <NodeElement key={node.id} node={node} onMouseDown={(clicked) => { if (canEdit && !edgeSource) setDragging(clicked); }} onClick={(clicked) => edgeSource?.selecting ? setEdgeSource(clicked) : handleNodeClick(clicked)} />)}
    </svg></div>
    <small>Strategists: click blank canvas to add a node; click a node to edit it; double-click a connection to delete it.</small>
    {nodeForm && <NodeForm node={nodeForm.id ? nodeForm : null} onSubmit={saveNode} onClose={() => setNodeForm(null)} />}
    {selected && nodeForm && canEdit && <button onClick={removeNode} style={{ marginTop: 12, color: '#b91c1c' }}>Delete selected node</button>}
    {edgeSource && !edgeSource.selecting && edgeTarget && <EdgeForm sourceNode={edgeSource} targetNode={edgeTarget} onSubmit={saveEdge} onClose={() => { setEdgeSource(null); setEdgeTarget(null); }} />}
    {showInsights && (
      <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ background: '#fff', width: '500px', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px 16px 32px' }}>
            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#111827' }}>Mesh Insights: {graph.title}</h3>
            <button onClick={() => setShowInsights(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}>&times;</button>
          </div>
          <div style={{ padding: '0 32px 32px 32px' }}>
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#60a5fa', letterSpacing: '0.05em', textTransform: 'uppercase' }}>DESCRIPTION</span>
              <p style={{ margin: '4px 0 0 0', color: '#374151' }}>{graph.description || 'No description available'}</p>
            </div>
            <div style={{ display: 'flex', gap: '48px', marginBottom: '32px' }}>
              <div style={{ borderLeft: '2px solid #111827', paddingLeft: '16px' }}>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Complexity Score</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{graph.complexityScore ? graph.complexityScore.toFixed(1) : '0.0'}</div>
              </div>
              <div style={{ borderLeft: '2px solid #111827', paddingLeft: '16px' }}>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Node Count</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{nodes.length}</div>
              </div>
            </div>
            <div style={{ marginBottom: '32px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', margin: '0 0 8px 0' }}>Conceptual Framework</h4>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>This mesh is currently in a high-level state with no specific child nodes defined yet.</p>
            </div>
            <button onClick={() => setShowInsights(false)} style={{ width: '100%', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' }}>
              Close Insight
            </button>
          </div>
        </div>
      </div>
    )}
  </div>;
};
export default GraphCanvas;
