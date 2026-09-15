import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as graphService from '../../services/graphService';
import NodeElement from './NodeElement';
import EdgeElement from './EdgeElement';
import NodeForm from '../nodes/NodeForm';
import EdgeForm from './EdgeForm';
import ErrorHandler from '../ErrorHandler';
import CapacityBar from '../common/CapacityBar';
import {
  findSensibleNodePosition,
  runForceSimulation,
  updateCanvasDOM,
  updateNodeAndConnectedEdgesDOM,
} from '../../utils/graphLayout';

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
  const [isSimulating, setIsSimulating] = useState(false);
  const [zoom, setZoom] = useState(1.0);

  const isOwner = Boolean(user?.id && graph?.ownerId && String(user.id) === String(graph.ownerId));
  const hasEditRole = user?.role?.includes('STRATEGIST') || user?.role?.includes('ADMIN');
  const canEdit = Boolean(hasEditRole && isOwner);

  // References to avoid re-creating callbacks and breaking useEffect dependencies
  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;

  const edgesRef = useRef(edges);
  edgesRef.current = edges;

  const canEditRef = useRef(canEdit);
  canEditRef.current = canEdit;

  const zoomRef = useRef(zoom);
  zoomRef.current = zoom;

  const svgRef = useRef(null);
  const simRef = useRef(null);
  const dragStartRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragEndTimeRef = useRef(0);
  const initialLayoutTriggeredRef = useRef(false);

  const triggerForceLayout = useCallback(
    ({
      isIncremental = false,
      newNodeId = null,
      nodesList = null,
      edgesList = null,
      width = null,
      persistNodeId = null,
    } = {}) => {
      const currentNodes = nodesList || nodesRef.current;
      const currentEdges = edgesList || edgesRef.current;
      if (!currentNodes || currentNodes.length === 0) return;

      if (simRef.current) {
        simRef.current.stop();
      }

      const svgWidth = width || svgRef.current?.clientWidth || 900;
      const svgHeight = 600;

      setIsSimulating(true);

      simRef.current = runForceSimulation({
        nodes: currentNodes,
        edges: currentEdges,
        width: svgWidth,
        height: svgHeight,
        isIncremental,
        newNodeId,
        onTick: (simNodes) => {
          // Zero React re-renders during simulation ticks! Direct SVG DOM update.
          updateCanvasDOM(simNodes, currentEdges);
        },
        onEnd: async (finalNodes) => {
          setIsSimulating(false);
          // Commit finalized positions to React state ONCE
          setNodes(finalNodes);

          if (canEditRef.current) {
            if (persistNodeId) {
              const target = finalNodes.find((n) => String(n.id) === String(persistNodeId));
              if (target) {
                try {
                  await graphService.updateNode(target.id, target);
                } catch {
                  // Silent catch for background position persistence
                }
              }
            } else if (!isIncremental) {
              try {
                await Promise.all(
                  finalNodes.map((n) => graphService.updateNode(n.id, n))
                );
                setMessage('Graph layout optimized and saved.');
              } catch {
                // Silent catch
              }
            }
          }
        },
      });
    },
    [] // Stable identity! Never triggers re-renders or effect re-runs.
  );

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await graphService.getFullGraph(id);
      setGraph(data);
      const loadedNodes = data.nodes || [];
      const loadedEdges = data.edges || [];
      setNodes(loadedNodes);
      setEdges(loadedEdges);

      const needsLayout =
        loadedNodes.length > 1 &&
        loadedNodes.some((n) => n.xPosition == null || (n.xPosition === 0 && n.yPosition === 0));

      if (needsLayout && !initialLayoutTriggeredRef.current) {
        initialLayoutTriggeredRef.current = true;
        setTimeout(() => {
          const svgWidth = svgRef.current?.clientWidth || 900;
          triggerForceLayout({
            isIncremental: false,
            nodesList: loadedNodes,
            edgesList: loadedEdges,
            width: svgWidth,
          });
        }, 120);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load this mesh');
    } finally {
      setLoading(false);
    }
  }, [id, triggerForceLayout]);

  useEffect(() => {
    initialLayoutTriggeredRef.current = false;
    loadData();
    return () => {
      if (simRef.current) {
        simRef.current.stop();
      }
    };
  }, [loadData]);

  const getCanvasCoords = (event) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const viewport = svgRef.current.querySelector('#canvas-viewport');
    if (viewport && viewport.getScreenCTM) {
      const ctm = viewport.getScreenCTM();
      if (ctm) {
        const pt = svgRef.current.createSVGPoint();
        pt.x = event.clientX;
        pt.y = event.clientY;
        const local = pt.matrixTransform(ctm.inverse());
        return { x: local.x, y: local.y };
      }
    }
    const rect = svgRef.current.getBoundingClientRect();
    const rawX = event.clientX - rect.left;
    const rawY = event.clientY - rect.top;
    const z = zoomRef.current || 1.0;
    const svgW = rect.width || 900;
    const svgH = rect.height || 600;
    const offsetX = (svgW * (1 - z)) / 2;
    const offsetY = (svgH * (1 - z)) / 2;
    return {
      x: (rawX - offsetX) / z,
      y: (rawY - offsetY) / z,
    };
  };

  const handleZoomIn = () => {
    setZoom((z) => Math.min(2.5, Math.round((z + 0.15) * 100) / 100));
  };

  const handleZoomOut = () => {
    setZoom((z) => Math.max(0.4, Math.round((z - 0.15) * 100) / 100));
  };

  const handleResetZoom = () => {
    setZoom(1.0);
  };

  const handleAddNodeClick = () => {
    if (!canEdit) return;
    setEdgeSource(null);
    setSelected(null);
    const svgWidth = svgRef.current?.clientWidth || 900;
    const sensible = findSensibleNodePosition(nodesRef.current, null, svgWidth, 600);
    setClickPos(sensible);
    setNodeForm({});
  };

  const handleCanvasClick = (event) => {
    if (!canEdit) return;
    if (isDraggingRef.current || Date.now() - dragEndTimeRef.current < 250) return;
    if (edgeSource) {
      setEdgeSource(null);
      setMessage('Connection cancelled.');
      return;
    }
    const coords = getCanvasCoords(event);
    const rect = event.currentTarget.getBoundingClientRect();
    const sensible = findSensibleNodePosition(nodesRef.current, coords, rect.width || 900, 600);
    setClickPos(sensible);
    setNodeForm({});
  };

  const handleNodeMouseDown = (node, event) => {
    if (!canEdit || edgeSource) return;
    if (simRef.current) {
      simRef.current.stop();
      setIsSimulating(false);
    }
    dragStartRef.current = {
      nodeId: node.id,
      startX: event.clientX,
      startY: event.clientY,
      currentX: node.xPosition || 0,
      currentY: node.yPosition || 0,
    };
    isDraggingRef.current = false;
  };

  const handleNodeClick = (node) => {
    if (!canEdit) return;
    // Suppress popup if user just dragged and released
    if (isDraggingRef.current || Date.now() - dragEndTimeRef.current < 250) return;

    if (edgeSource) {
      if (edgeSource.selecting) {
        setEdgeSource(node);
        setMessage(`Source node selected: "${node.label}". Now click target node.`);
        return;
      }
      if (edgeSource.id === node.id) {
        setEdgeSource(null);
        setMessage('Connection cancelled.');
        return;
      }
      setEdgeTarget(node);
      return;
    }
    setSelected(node);
    setNodeForm(node);
  };

  const saveNode = async (form) => {
    try {
      const isNew = !nodeForm?.id;
      const payload = {
        label: form.label,
        type: form.type,
        xPosition: isNew ? clickPos.x : (nodeForm.xPosition ?? clickPos.x),
        yPosition: isNew ? clickPos.y : (nodeForm.yPosition ?? clickPos.y),
      };
      const saved = isNew
        ? await graphService.addNodes(id, payload)
        : await graphService.updateNode(nodeForm.id, payload);

      const nextNodes = isNew
        ? [...nodes, saved]
        : nodes.map((node) => (node.id === saved.id ? saved : node));

      setNodes(nextNodes);
      setNodeForm(null);
      setSelected(saved);
      setMessage(isNew ? 'Node added.' : 'Node updated.');

      // If new node, gently relax layout incrementally
      if (isNew) {
        setTimeout(() => {
          triggerForceLayout({
            isIncremental: true,
            newNodeId: saved.id,
            nodesList: nextNodes,
            edgesList: edgesRef.current,
            persistNodeId: saved.id,
          });
        }, 50);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save node');
    }
  };

  const removeNode = async () => {
    if (!selected || !window.confirm(`Delete "${selected.label}" and its connections?`)) return;
    try {
      await graphService.deleteNode(selected.id);
      setNodes((items) => items.filter((node) => node.id !== selected.id));
      setEdges((items) => items.filter((edge) => edge.sourceNodeId !== selected.id && edge.targetNodeId !== selected.id));
      setSelected(null);
      setNodeForm(null);
      setMessage('Node deleted.');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete node');
    }
  };

  const saveEdge = async (form) => {
    try {
      const saved = await graphService.createEdge({ ...form, graphId: Number(id) });
      const nextEdges = [...edges, saved];
      setEdges(nextEdges);
      setEdgeSource(null);
      setEdgeTarget(null);
      setMessage('Connection created.');

      setTimeout(() => {
        triggerForceLayout({
          isIncremental: true,
          nodesList: nodesRef.current,
          edgesList: nextEdges,
        });
      }, 50);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create connection');
    }
  };

  const removeEdge = async (edgeId) => {
    if (!canEdit || !window.confirm('Delete this connection?')) return;
    try {
      await graphService.deleteEdge(edgeId);
      setEdges((items) => items.filter((edge) => edge.id !== edgeId));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete connection');
    }
  };

  const calculate = async () => {
    try {
      const updated = await graphService.calculateComplexity(id);
      setGraph((current) => ({ ...current, complexityScore: updated.complexityScore }));
    } catch {
      setError('Unable to calculate complexity');
    }
  };

  const invite = async (event) => {
    event.preventDefault();
    try {
      await graphService.inviteCollaborator(Number(id), inviteeUsername);
      setInviteeUsername('');
      setMessage('Invitation sent.');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send invitation');
    }
  };

  const moveNode = (event) => {
    if (!dragStartRef.current || !canEdit) return;
    const dx = event.clientX - dragStartRef.current.startX;
    const dy = event.clientY - dragStartRef.current.startY;

    if (!isDraggingRef.current) {
      if (Math.hypot(dx, dy) >= 5) {
        isDraggingRef.current = true;
      } else {
        return;
      }
    }

    const coords = getCanvasCoords(event);
    const svgRect = svgRef.current
      ? svgRef.current.getBoundingClientRect()
      : { width: 900, height: 600 };
    const svgW = svgRect.width || 900;
    const clampedX = Math.round(Math.max(45, Math.min(svgW - 45, coords.x)));
    const clampedY = Math.round(Math.max(35, Math.min(565, coords.y)));

    dragStartRef.current.currentX = clampedX;
    dragStartRef.current.currentY = clampedY;

    // Direct DOM update during drag for 60fps responsiveness without React re-renders
    updateNodeAndConnectedEdgesDOM(
      dragStartRef.current.nodeId,
      clampedX,
      clampedY,
      nodesRef.current,
      edgesRef.current
    );
  };

  const finishMove = async () => {
    if (!dragStartRef.current) return;
    const didDrag = isDraggingRef.current;
    const { nodeId, currentX, currentY } = dragStartRef.current;
    dragStartRef.current = null;
    isDraggingRef.current = false;

    if (didDrag) {
      dragEndTimeRef.current = Date.now();
      const updatedNodes = nodesRef.current.map((n) =>
        n.id === nodeId ? { ...n, xPosition: currentX, yPosition: currentY } : n
      );
      setNodes(updatedNodes);

      const moved = updatedNodes.find((n) => n.id === nodeId);
      if (moved) {
        try {
          await graphService.updateNode(moved.id, moved);
        } catch (err) {
          setError(err.response?.data?.message || 'Unable to save node position');
        }
      }
    }
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
            <span className="badge lime">[ GRAPH CANVAS ]</span>
            {graph.ownerUsername && (
              <span className="badge" style={{ fontSize: '0.7rem' }}>
                BY: {graph.ownerUsername}
              </span>
            )}
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
          {nodes.length > 1 && canEdit && (
            <button
              onClick={() => triggerForceLayout({ isIncremental: false })}
              style={{ background: 'var(--surface-color)' }}
              title="Optimize graph layout into force-directed network clusters"
              disabled={isSimulating}
            >
              <span>{isSimulating ? 'Optimizing...' : 'Auto-Layout'}</span>
              <span style={{ fontSize: '1rem', lineHeight: 1 }}>⟳</span>
            </button>
          )}
          {nodes.length > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--surface-color)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '0 0.25rem'
            }}>
              <button
                type="button"
                onClick={handleZoomOut}
                title="Zoom Out (-)"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0.4rem 0.55rem',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 700
                }}
              >
                −
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                title="Reset Zoom (100%)"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0.4rem 0.4rem',
                  color: zoom === 1.0 ? 'var(--accent-color)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.725rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                type="button"
                onClick={handleZoomIn}
                title="Zoom In (+)"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0.4rem 0.55rem',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: 700
                }}
              >
                +
              </button>
            </div>
          )}
          {canEdit && (
            <>
              <button
                onClick={handleAddNodeClick}
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
          ref={svgRef}
          width="100%"
          height="100%"
          onClick={handleCanvasClick}
          onMouseMove={moveNode}
          onMouseUp={finishMove}
          onMouseLeave={finishMove}
          onWheel={(e) => {
            if (e.ctrlKey || e.metaKey) {
              e.preventDefault();
              const delta = e.deltaY < 0 ? 0.15 : -0.15;
              setZoom((z) => Math.max(0.4, Math.min(2.5, Math.round((z + delta) * 100) / 100)));
            }
          }}
        >
          {/* Subtle Canvas Dot Grid Pattern */}
          <defs>
            <pattern id="canvas-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="rgba(255, 255, 255, 0.08)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#canvas-grid)" />

          {/* VIEWPORT GROUP WITH ZOOM TRANSFORM */}
          <g
            id="canvas-viewport"
            transform={`translate(${((svgRef.current?.clientWidth || 900) * (1 - zoom)) / 2}, ${(600 * (1 - zoom)) / 2}) scale(${zoom})`}
          >
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
                isSelected={selected?.id === node.id}
                onMouseDown={(clicked, e) => handleNodeMouseDown(clicked, e)}
                onClick={(clicked) => handleNodeClick(clicked)}
              />
            ))}
          </g>
        </svg>

        {/* Floating Zoom Controls: [-] [100%] [+] */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'rgba(11, 13, 18, 0.88)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--radius-md)',
          padding: '4px 6px',
          backdropFilter: 'blur(8px)',
          zIndex: 10,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)'
        }}>
          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom Out (-)"
            style={{
              width: '28px',
              height: '28px',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-secondary)',
              fontSize: '1.1rem',
              fontWeight: 700,
              cursor: 'pointer',
              lineHeight: 1
            }}
          >
            −
          </button>
          <button
            type="button"
            onClick={handleResetZoom}
            title="Reset Zoom to 100%"
            style={{
              padding: '0 8px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              color: zoom === 1.0 ? 'var(--accent-color)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom In (+)"
            style={{
              width: '28px',
              height: '28px',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-secondary)',
              fontSize: '1.1rem',
              fontWeight: 700,
              cursor: 'pointer',
              lineHeight: 1
            }}
          >
            +
          </button>
        </div>

        {/* Empty State Overlay */}
        {nodes.length === 0 && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
            pointerEvents: canEdit ? 'none' : 'auto',
            background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.04) 0%, transparent 70%)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              border: '1px dashed var(--accent-border, rgba(16, 185, 129, 0.4))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              color: 'var(--accent-color, #10b981)',
              fontSize: '1.5rem',
              fontFamily: 'var(--font-mono)'
            }}>
              ∅
            </div>
            <h3 style={{
              margin: '0 0 0.5rem 0',
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.05em',
              color: 'var(--text-primary)',
              fontSize: '1.25rem'
            }}>
              This graph is empty
            </h3>
            <p style={{
              margin: 0,
              maxWidth: '440px',
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6
            }}>
              {canEdit
                ? 'No concepts or connections have been created yet. Click anywhere on the canvas or click below to add your first node.'
                : 'This knowledge mesh does not contain any concept nodes yet. The author has not published any nodes to this graph.'}
            </p>
            {canEdit && (
              <button
                type="button"
                onClick={handleAddNodeClick}
                className="btn primary"
                style={{ marginTop: '1.25rem', pointerEvents: 'auto' }}
              >
                <span>+ Add First Node</span>
              </button>
            )}
          </div>
        )}
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
        <span>
          {canEdit
            ? 'INTERACTION: Click empty canvas to add node • Drag to position • Double click connection to remove'
            : 'VIEW MODE: Read-only canvas view • Exploration enabled'}
        </span>
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
