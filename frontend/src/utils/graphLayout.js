import {
  forceSimulation,
  forceManyBody,
  forceLink,
  forceCollide,
  forceX,
  forceY,
} from 'd3-force';

/**
 * Calculates adaptive node dimensions and collision radius based on label length.
 * Ensures longer labels like "Anatomical Region" fit comfortably without truncation.
 */
export const calculateNodeDimensions = (label = '') => {
  const text = (label || 'Node').trim();
  const charWidth = 7.2;
  const paddingX = 28;
  const width = Math.max(72, Math.min(220, Math.round(text.length * charWidth + paddingX)));
  const height = 36;
  const rx = 18;
  // Collision radius covers capsule diagonal plus clearance buffer
  const collisionRadius = Math.round(Math.hypot(width / 2, height / 2)) + 14;
  return { width, height, rx, collisionRadius, text };
};

/**
 * Finds a sensible, non-overlapping position on the canvas for a new node.
 * If preferredPos is provided, checks for collision and nudges if necessary.
 * If no preferredPos is provided, searches outwards from centroid to find maximum clearance.
 */
export const findSensibleNodePosition = (
  existingNodes = [],
  preferredPos = null,
  canvasWidth = 900,
  canvasHeight = 600,
  label = ''
) => {
  const { collisionRadius } = calculateNodeDimensions(label);
  const margin = 70;
  const minX = margin;
  const maxX = Math.max(minX + 100, canvasWidth - margin);
  const minY = margin;
  const maxY = Math.max(minY + 100, canvasHeight - margin);
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  if (!existingNodes || existingNodes.length === 0) {
    return preferredPos && preferredPos.x && preferredPos.y
      ? {
          x: Math.max(minX, Math.min(maxX, preferredPos.x)),
          y: Math.max(minY, Math.min(maxY, preferredPos.y)),
        }
      : { x: centerX, y: centerY };
  }

  const checkCollision = (x, y) => {
    for (const node of existingNodes) {
      const nx = node.xPosition ?? node.x ?? centerX;
      const ny = node.yPosition ?? node.y ?? centerY;
      const otherRadius = calculateNodeDimensions(node.label).collisionRadius;
      const dist = Math.hypot(x - nx, y - ny);
      if (dist < collisionRadius + otherRadius + 12) {
        return true;
      }
    }
    return false;
  };

  // If user clicked at a specific point, check if that point is free
  if (preferredPos && preferredPos.x && preferredPos.y) {
    const px = Math.max(minX, Math.min(maxX, preferredPos.x));
    const py = Math.max(minY, Math.min(maxY, preferredPos.y));
    if (!checkCollision(px, py)) {
      return { x: px, y: py };
    }
    // If preferred spot collides, spiral around preferred spot
    for (let step = 1; step <= 16; step++) {
      const radius = step * 35;
      const angles = 8 + step * 2;
      for (let a = 0; a < angles; a++) {
        const theta = (2 * Math.PI * a) / angles;
        const cx = Math.max(minX, Math.min(maxX, px + Math.cos(theta) * radius));
        const cy = Math.max(minY, Math.min(maxY, py + Math.sin(theta) * radius));
        if (!checkCollision(cx, cy)) {
          return { x: Math.round(cx), y: Math.round(cy) };
        }
      }
    }
  }

  // Centroid of existing nodes
  let sumX = 0;
  let sumY = 0;
  for (const n of existingNodes) {
    sumX += n.xPosition ?? n.x ?? centerX;
    sumY += n.yPosition ?? n.y ?? centerY;
  }
  const avgX = sumX / existingNodes.length;
  const avgY = sumY / existingNodes.length;
  const startX = Math.max(minX, Math.min(maxX, (avgX + centerX) / 2));
  const startY = Math.max(minY, Math.min(maxY, (avgY + centerY) / 2));

  // Spiral outwards to find the first free location with clearance
  for (let step = 1; step <= 25; step++) {
    const radius = step * 40;
    const angles = 8 + step * 2;
    for (let a = 0; a < angles; a++) {
      const theta = (2 * Math.PI * a) / angles;
      const cx = Math.max(minX, Math.min(maxX, startX + Math.cos(theta) * radius));
      const cy = Math.max(minY, Math.min(maxY, startY + Math.sin(theta) * radius));
      if (!checkCollision(cx, cy)) {
        return { x: Math.round(cx), y: Math.round(cy) };
      }
    }
  }

  // Fallback: slight random offset from center
  return {
    x: Math.round(Math.max(minX, Math.min(maxX, centerX + (Math.random() - 0.5) * 120))),
    y: Math.round(Math.max(minY, Math.min(maxY, centerY + (Math.random() - 0.5) * 120))),
  };
};

/**
 * Updates SVG DOM elements directly during simulation ticks without causing React re-renders.
 */
export const updateCanvasDOM = (simNodes = [], edges = []) => {
  const nodeMap = new Map();
  for (let i = 0; i < simNodes.length; i++) {
    const d = simNodes[i];
    const x = Math.round(d.x);
    const y = Math.round(d.y);
    nodeMap.set(d.id, { x, y });

    const el = document.getElementById(`node-element-${d.id}`);
    if (el) {
      el.setAttribute('transform', `translate(${x}, ${y})`);
    }
  }

  if (edges && edges.length > 0) {
    for (let i = 0; i < edges.length; i++) {
      const e = edges[i];
      const src = nodeMap.get(e.sourceNodeId);
      const tgt = nodeMap.get(e.targetNodeId);
      if (src && tgt) {
        const line = document.getElementById(`edge-line-${e.id}`);
        if (line) {
          line.setAttribute('x1', src.x);
          line.setAttribute('y1', src.y);
          line.setAttribute('x2', tgt.x);
          line.setAttribute('y2', tgt.y);
        }
        const label = document.getElementById(`edge-label-${e.id}`);
        if (label) {
          label.setAttribute('transform', `translate(${(src.x + tgt.x) / 2}, ${(src.y + tgt.y) / 2})`);
        }
      }
    }
  }
};

/**
 * Updates a single dragged node and its connected edges directly in the DOM.
 */
export const updateNodeAndConnectedEdgesDOM = (nodeId, x, y, allNodes = [], edges = []) => {
  const nodeEl = document.getElementById(`node-element-${nodeId}`);
  if (nodeEl) {
    nodeEl.setAttribute('transform', `translate(${x}, ${y})`);
  }

  const nodePosMap = new Map(allNodes.map((n) => [n.id, { x: n.xPosition || 0, y: n.yPosition || 0 }]));
  nodePosMap.set(nodeId, { x, y });

  if (edges && edges.length > 0) {
    for (let i = 0; i < edges.length; i++) {
      const e = edges[i];
      if (e.sourceNodeId === nodeId || e.targetNodeId === nodeId) {
        const src = nodePosMap.get(e.sourceNodeId);
        const tgt = nodePosMap.get(e.targetNodeId);
        if (src && tgt) {
          const line = document.getElementById(`edge-line-${e.id}`);
          if (line) {
            line.setAttribute('x1', src.x);
            line.setAttribute('y1', src.y);
            line.setAttribute('x2', tgt.x);
            line.setAttribute('y2', tgt.y);
          }
          const label = document.getElementById(`edge-label-${e.id}`);
          if (label) {
            label.setAttribute('transform', `translate(${(src.x + tgt.x) / 2}, ${(src.y + tgt.y) / 2})`);
          }
        }
      }
    }
  }
};

/**
 * Executes a force-directed network simulation with repulsion, link springs,
 * collision detection (using label dimensions), and gentle centering.
 * Settles cleanly in ~120-140 ticks instead of running indefinitely.
 */
export const runForceSimulation = ({
  nodes = [],
  edges = [],
  width = 900,
  height = 600,
  isIncremental = false,
  newNodeId = null,
  onTick,
  onEnd,
}) => {
  if (!nodes || nodes.length === 0) {
    if (onEnd) onEnd([]);
    return { stop: () => {} };
  }

  const margin = 65;
  const minX = margin;
  const maxX = Math.max(minX + 100, width - margin);
  const minY = margin;
  const maxY = Math.max(minY + 100, height - margin);
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  // Prepare simulation node data
  const simNodes = nodes.map((node) => {
    const { collisionRadius } = calculateNodeDimensions(node.label);
    const hasExistingX = typeof node.xPosition === 'number' && node.xPosition > 0;
    const hasExistingY = typeof node.yPosition === 'number' && node.yPosition > 0;
    const isTargetNewNode = newNodeId && String(node.id) === String(newNodeId);

    let initialX = hasExistingX ? node.xPosition : centerX + (Math.random() - 0.5) * 80;
    let initialY = hasExistingY ? node.yPosition : centerY + (Math.random() - 0.5) * 80;

    return {
      id: node.id,
      x: initialX,
      y: initialY,
      initialX,
      initialY,
      vx: 0,
      vy: 0,
      collisionRadius,
      isNew: isTargetNewNode,
      original: node,
    };
  });

  // Map simulation links
  const nodeMap = new Map(simNodes.map((n) => [n.id, n]));
  const simLinks = edges
    .filter((e) => nodeMap.has(e.sourceNodeId) && nodeMap.has(e.targetNodeId))
    .map((e) => ({
      id: e.id,
      source: e.sourceNodeId,
      target: e.targetNodeId,
      weight: e.weight || 1.0,
      relationshipType: e.relationshipType,
    }));

  // Create d3-force simulation
  const simulation = forceSimulation(simNodes)
    .force(
      'charge',
      forceManyBody()
        .strength((d) => (isIncremental ? -260 : -340) - d.collisionRadius * 1.6)
        .distanceMin(30)
        .distanceMax(700)
    )
    .force(
      'link',
      forceLink(simLinks)
        .id((d) => d.id)
        .distance((d) => {
          const sRad = d.source.collisionRadius || 45;
          const tRad = d.target.collisionRadius || 45;
          return sRad + tRad + 55 + (d.weight || 1.0) * 8;
        })
        .strength(0.55)
    )
    .force(
      'collide',
      forceCollide()
        .radius((d) => d.collisionRadius + 10)
        .strength(0.95)
        .iterations(3)
    );

  if (isIncremental) {
    // For incremental simulation, anchor existing nodes near their positions
    simulation
      .force(
        'anchorX',
        forceX((d) => (d.isNew ? centerX : d.initialX)).strength((d) => (d.isNew ? 0.05 : 0.3))
      )
      .force(
        'anchorY',
        forceY((d) => (d.isNew ? centerY : d.initialY)).strength((d) => (d.isNew ? 0.05 : 0.3))
      )
      .alpha(0.35)
      .alphaDecay(0.05);
  } else {
    // For full simulation, center gently
    simulation
      .force('x', forceX(centerX).strength(0.045))
      .force('y', forceY(centerY).strength(0.045))
      .alpha(0.7)
      .alphaDecay(0.038);
  }

  simulation.alphaMin(0.003);

  simulation.on('tick', () => {
    for (let i = 0; i < simNodes.length; i++) {
      const d = simNodes[i];
      d.x = Math.max(minX, Math.min(maxX, d.x));
      d.y = Math.max(minY, Math.min(maxY, d.y));
    }

    if (onTick) {
      onTick(simNodes);
    }
  });

  simulation.on('end', () => {
    simulation.stop();
    if (onEnd) {
      const finalized = simNodes.map((d) => ({
        ...d.original,
        xPosition: Math.round(d.x),
        yPosition: Math.round(d.y),
      }));
      onEnd(finalized);
    }
  });

  return {
    stop: () => simulation.stop(),
    restart: (alpha = 0.3) => simulation.alpha(alpha).restart(),
  };
};
