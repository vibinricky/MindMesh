import React from 'react';
import { calculateNodeDimensions } from '../../utils/graphLayout';

const NodeElement = ({ node, isSelected = false, onClick, onMouseDown }) => {
  const { width, height, rx, text } = calculateNodeDimensions(node?.label);

  return (
    <g 
      id={`node-element-${node.id}`}
      transform={`translate(${node.xPosition || 0}, ${node.yPosition || 0})`} 
      onClick={(e) => { e.stopPropagation(); onClick?.(node, e); }}
      onMouseDown={(e) => { e.stopPropagation(); onMouseDown?.(node, e); }}
      style={{ cursor: 'pointer', userSelect: 'none' }}
    >
      <title>{node.label || 'Node'}{node.type ? ` (${node.type})` : ''}</title>

      {/* Outer concentric subtle ring/boundary */}
      <rect 
        x={-(width + 10) / 2} 
        y={-(height + 10) / 2} 
        width={width + 10} 
        height={height + 10} 
        rx={rx + 4} 
        fill="none" 
        stroke={isSelected ? 'rgba(220, 255, 2, 0.45)' : 'rgba(220, 255, 2, 0.18)'} 
        strokeWidth="1" 
        strokeDasharray="3 3" 
      />
      
      {/* Node Body */}
      <rect 
        x={-width / 2} 
        y={-height / 2} 
        width={width} 
        height={height} 
        rx={rx} 
        fill="#0f1115" 
        stroke={isSelected ? '#ffffff' : '#dcff02'} 
        strokeWidth={isSelected ? 2.5 : 2}
        filter={isSelected ? 'drop-shadow(0 0 6px rgba(220, 255, 2, 0.6))' : 'none'}
      />
      
      {/* Node Accent Indicator Dot */}
      <circle cx={-width / 2 + 13} cy="0" r="3.5" fill="#dcff02" />

      {/* Full Node Label */}
      <text 
        x="6" 
        y="0" 
        textAnchor="middle" 
        dominantBaseline="central" 
        fill="#ffffff" 
        fontSize="11px"
        fontFamily="'Space Grotesk', sans-serif"
        fontWeight="700"
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {text}
      </text>
    </g>
  );
};

export default NodeElement;
