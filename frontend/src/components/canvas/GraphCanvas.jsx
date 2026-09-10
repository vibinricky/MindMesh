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
  const isStrategist = user?.role === 'ROLE_RESEARCH_STRATEGIST' || user?.role === 'RESEARCH_STRATEGIST';
  const canEdit = isStrategist && graph?.ownerId === user?.id;

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

  if (loading) {
    return (
      <div className="container" style={{ padding: '3rem 0', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
        Loading interactive canvas...
      </div>
    );
  }

  if (error && !graph) {
    return (
      <div className="container" style={{ paddingTop: '2rem' }}>
        <ErrorHandler error={{ message: error }} onRetry={loadData} />
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '3rem' }}>
      <ErrorHandler error={error ? { message: error } : null} onRetry={loadData} />
      
      {message && (
        <div style={{
          padding: '0.65rem 1rem',
          background: 'var(--accent-dim)',
          border: '1px solid var(--accent-border)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--accent-color)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>[✓] {message}</span>
        </div>
      )}

      {/* TOP HEADER & ACTION CONTROLS */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge lime">[ GRAPH CANVAS ]</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-color)' }}>
              NODES: {nodes.length} | EDGES: {edges.length}
            </span>
          </div>
          <h1 style={{ margin: 0, fontSize: 'clamp(1.75rem, 3vw, 2.25rem)' }}>{graph.title}</h1>
          <p className="muted" style={{ margin: '0.35rem 0 0 0', maxWidth: '640px' }}>
            {graph.description || 'Interactive multi-node knowledge mesh.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => setShowInsights(true)} style={{ background: 'var(--surface-color)' }}>
            <span>View Insights</span>
            <span>↗</span>
          </button>
          {canEdit && (
            <>
              <button
                onClick={() => { setEdgeSource(null); setSelected(null); setClickPos({ x: 300, y: 220 }); setNodeForm({}); }}
                className="btn primary"
              >
                <span>+ Add Node</span>
              </button>
              <button
                onClick={() => { setEdgeSource({ selecting: true }); setMessage('Click a source node to begin connection.'); }}
                style={{ background: 'var(--surface-color)' }}
              >
                <span>Connect Nodes</span>
              </button>
              <button
                onClick={calculate}
                style={{ background: 'var(--surface-color)' }}
              >
                <span>Calculate Score</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* COLLABORATOR INVITE BAR */}
      {canEdit && (
        <form
          onSubmit={invite}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'var(--surface-color)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '0.4rem 0.75rem',
            marginBottom: '1rem',
            maxWidth: '520px'
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.725rem', color: 'var(--text-secondary)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            Invite Collaborator:
          </span>
          <input
            value={inviteeUsername}
            onChange={(e) => setInviteeUsername(e.target.value)}
            placeholder="Username"
            required
            style={{
              padding: '0.35rem 0.65rem',
              fontSize: '0.8rem',
              border: '1px solid var(--border-strong)',
              background: 'var(--surface-color-elevated)'
            }}
          />
          <button type="submit" className="btn primary" style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
            Send Invite
          </button>
        </form>
      )}

      {/* CONNECTION MODE BANNER */}
      {edgeSource && (
        <div style={{
          background: 'var(--accent-dim)',
          border: '1px solid var(--accent-border)',
          borderRadius: 'var(--radius-md)',
          padding: '0.65rem 1rem',
          marginBottom: '1rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          color: 'var(--accent-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>
            [CONNECT MODE] {edgeSource.selecting ? 'Click a source node on the canvas' : `Select target node to connect from "${edgeSource.label}"`}
          </span>
          <button
            onClick={() => { setEdgeSource(null); setMessage('Connection cancelled.'); }}
            style={{ background: 'transparent', border: '1px solid var(--accent-color)', color: 'var(--accent-color)', padding: '0.2rem 0.6rem', fontSize: '0.7rem' }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* INTERACTIVE SVG CANVAS */}
      <div style={{
        height: 600,
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        background: '#090a0f',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.8)'
      }}>
        <svg
          width="100%"
          height="100%"
          onClick={handleCanvasClick}
          onMouseMove={moveNode}
          onMouseUp={finishMove}
          onMouseLeave={finishMove}
        >
          {/* Subtle Canvas Dot Grid Pattern */}
          <defs>
            <pattern id="canvas-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="rgba(255, 255, 255, 0.08)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#canvas-grid)" />

          {/* Edges */}
          {edges.map((edge) => (
            <g key={edge.id} onDoubleClick={(event) => { event.stopPropagation(); removeEdge(edge.id); }}>
              <EdgeElement
                edge={edge}
                sourceNode={nodes.find((node) => node.id === edge.sourceNodeId)}
                targetNode={nodes.find((node) => node.id === edge.targetNodeId)}
              />
            </g>
          ))}

          {/* Nodes */}
          {nodes.map((node) => (
            <NodeElement
              key={node.id}
              node={node}
              onMouseDown={(clicked) => { if (canEdit && !edgeSource) setDragging(clicked); }}
              onClick={(clicked) => edgeSource?.selecting ? setEdgeSource(clicked) : handleNodeClick(clicked)}
            />
          ))}
        </svg>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '0.75rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.725rem',
        color: 'var(--text-muted)'
      }}>
        <span>INTERACTION: Click empty canvas to add node • Drag to position • Double click connection to remove</span>
        <span>MINDMESH CANVAS V2</span>
      </div>

      {nodeForm && <NodeForm node={nodeForm.id ? nodeForm : null} onSubmit={saveNode} onClose={() => setNodeForm(null)} />}
      {selected && nodeForm && canEdit && (
        <button onClick={removeNode} className="btn danger" style={{ marginTop: 12 }}>
          Delete Selected Node
        </button>
      )}
      {edgeSource && !edgeSource.selecting && edgeTarget && (
        <EdgeForm
          sourceNode={edgeSource}
          targetNode={edgeTarget}
          onSubmit={saveEdge}
          onClose={() => { setEdgeSource(null); setEdgeTarget(null); }}
        />
      )}

      {/* INSIGHTS MODAL */}
      {showInsights && (
        <div className="modal-overlay" onClick={() => setShowInsights(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div>
                <span className="badge lime" style={{ marginBottom: '0.25rem' }}>[ MESH TELEMETRY ]</span>
                <h3 style={{ margin: 0 }}>Mesh Insights</h3>
              </div>
              <button
                onClick={() => setShowInsights(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--text-secondary)' }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                TITLE & DESCRIPTION
              </span>
              <h4 style={{ margin: '0.25rem 0', color: 'var(--text-primary)' }}>{graph.title}</h4>
              <p className="muted" style={{ margin: 0, fontSize: '0.875rem' }}>{graph.description || 'No description provided.'}</p>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <CapacityBar score={graph.complexityScore || 0} />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              background: 'var(--surface-color-elevated)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Active Nodes</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{nodes.length}</div>
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Active Edges</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-color)' }}>{edges.length}</div>
              </div>
            </div>

            <button
              onClick={() => setShowInsights(false)}
              className="btn primary"
              style={{ width: '100%' }}
            >
              <span>Close Insights</span>
              <span>↗</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphCanvas;
