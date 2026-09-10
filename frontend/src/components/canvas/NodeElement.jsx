import React from 'react';

const NodeElement = ({ node, onClick, onMouseDown }) => {
  return (
    <g 
      transform={`translate(${node.xPosition || 0}, ${node.yPosition || 0})`} 
      onClick={(e) => { e.stopPropagation(); onClick(node); }}
      onMouseDown={(e) => { e.stopPropagation(); onMouseDown?.(node); }}
      style={{ cursor: 'pointer' }}
    >
      {/* Outer concentric subtle ring */}
      <circle r="36" fill="none" stroke="rgba(220, 255, 2, 0.2)" strokeWidth="1" strokeDasharray="3 3" />
      
      {/* Node Body */}
      <circle r="28" fill="#0f1115" stroke="#dcff02" strokeWidth="2" />
      
      {/* Node Center Accent */}
      <circle r="3" fill="#dcff02" cy="-14" />

      {/* Node Label */}
      <text 
        textAnchor="middle" 
        dy=".35em" 
        fill="#ffffff" 
        fontSize="11px"
        fontFamily="'Space Grotesk', sans-serif"
        fontWeight="700"
        style={{ pointerEvents: 'none' }}
      >
        {node.label && node.label.length > 10 ? node.label.substring(0, 10) + '...' : (node.label || 'Node')}
      </text>
    </g>
  );
};

export default NodeElement;
