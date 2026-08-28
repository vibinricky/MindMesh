import React from 'react';

const NodeElement = ({ node, onClick, onMouseDown }) => {
  return (
    <g 
      transform={`translate(${node.xPosition || 0}, ${node.yPosition || 0})`} 
      onClick={(e) => { e.stopPropagation(); onClick(node); }}
      onMouseDown={(e) => { e.stopPropagation(); onMouseDown?.(node); }}
      style={{ cursor: 'pointer' }}
    >
      <circle r="30" fill="#007bff" stroke="#0056b3" strokeWidth="2" />
      <text 
        textAnchor="middle" 
        dy=".3em" 
        fill="#fff" 
        fontSize="12px"
        style={{ pointerEvents: 'none' }}
      >
        {node.label.length > 10 ? node.label.substring(0, 10) + '...' : node.label}
      </text>
    </g>
  );
};

export default NodeElement;
