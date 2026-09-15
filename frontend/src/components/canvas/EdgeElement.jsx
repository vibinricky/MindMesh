import React from 'react';

const EdgeElement = ({ edge, sourceNode, targetNode }) => {
  if (!sourceNode || !targetNode) return null;

  const sx = sourceNode.xPosition || 0;
  const sy = sourceNode.yPosition || 0;
  const tx = targetNode.xPosition || 0;
  const ty = targetNode.yPosition || 0;
  
  const midX = (sx + tx) / 2;
  const midY = (sy + ty) / 2;

  return (
    <g id={`edge-element-${edge.id}`} style={{ cursor: 'pointer' }}>
      <line 
        id={`edge-line-${edge.id}`}
        x1={sx} 
        y1={sy} 
        x2={tx} 
        y2={ty} 
        stroke="#323746" 
        strokeWidth={Math.max(1.5, edge.weight || 1.5)} 
      />
      {edge.relationshipType && (
        <g id={`edge-label-${edge.id}`} transform={`translate(${midX}, ${midY})`}>
          <rect
            x={-Math.max(36, Math.round((edge.relationshipType.length * 6.4 + 18) / 2))}
            y="-10"
            width={Math.max(72, Math.round(edge.relationshipType.length * 6.4 + 18))}
            height="20"
            fill="#0b0d12"
            stroke="#222631"
            strokeWidth="1"
            rx="4"
          />
          <text 
            x="0" 
            y="3" 
            fill="#dcff02" 
            fontSize="9px" 
            fontFamily="'Space Mono', monospace"
            textAnchor="middle"
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            {edge.relationshipType}
          </text>
        </g>
      )}
    </g>
  );
};

export default EdgeElement;
