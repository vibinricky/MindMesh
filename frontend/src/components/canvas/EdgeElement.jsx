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
    <g>
      <line 
        x1={sx} 
        y1={sy} 
        x2={tx} 
        y2={ty} 
        stroke="#999" 
        strokeWidth={Math.max(1, edge.weight || 1)} 
      />
      <text 
        x={midX} 
        y={midY} 
        fill="#666" 
        fontSize="10px" 
        textAnchor="middle"
        dy="-5"
        style={{ pointerEvents: 'none' }}
      >
        {edge.relationshipType}
      </text>
    </g>
  );
};

export default EdgeElement;
