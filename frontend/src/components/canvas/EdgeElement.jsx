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
    <g style={{ cursor: 'pointer' }}>
      <line 
        x1={sx} 
        y1={sy} 
        x2={tx} 
        y2={ty} 
        stroke="#323746" 
        strokeWidth={Math.max(1.5, edge.weight || 1.5)} 
      />
      {edge.relationshipType && (
        <g transform={`translate(${midX}, ${midY})`}>
          <rect
            x="-35"
            y="-10"
            width="70"
            height="18"
            fill="#0b0d12"
            stroke="#222631"
            strokeWidth="1"
            rx="3"
          />
          <text 
            x="0" 
            y="3" 
            fill="#dcff02" 
            fontSize="9px" 
            fontFamily="'Space Mono', monospace"
            textAnchor="middle"
            style={{ pointerEvents: 'none' }}
          >
            {edge.relationshipType.length > 10 ? edge.relationshipType.substring(0, 10) + '..' : edge.relationshipType}
          </text>
        </g>
      )}
    </g>
  );
};

export default EdgeElement;
