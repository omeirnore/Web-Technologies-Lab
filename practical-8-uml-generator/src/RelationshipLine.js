/**
 * RelationshipLine.js
 *
 * PURPOSE: Draws an SVG arrow from one class box to another to show
 * their relationship (inheritance, association, etc.)
 *
 * HOW IT WORKS:
 *   - Each class box has an (x, y) position and we know its approximate
 *     width (220px) and height.
 *   - We calculate the CENTER of each box and draw a line between them.
 *   - The line style changes based on relationship type:
 *       • inheritance  → solid line with a hollow triangle arrowhead
 *       • association  → solid line with a simple arrow
 *       • aggregation  → solid line with a hollow diamond
 *       • composition  → solid line with a filled diamond
 *       • implementation → dashed line with a hollow triangle
 *
 * PROPS:
 *   fromClass  — the source class object (has x, y)
 *   toClass    — the target class object (has x, y)
 *   type       — one of the relationship types above
 */
import React from 'react';

export default function RelationshipLine({ fromClass, toClass, type }) {
  if (!fromClass || !toClass) return null;

  // Approximate center of each class box
  // We assume boxes are ~220px wide and ~160px tall
  const BOX_W = 220;
  const BOX_H = 160;

  const x1 = fromClass.x + BOX_W / 2;
  const y1 = fromClass.y + BOX_H / 2;
  const x2 = toClass.x + BOX_W / 2;
  const y2 = toClass.y + BOX_H / 2;

  // Determine line style
  const isDashed = type === 'implementation';
  const strokeDash = isDashed ? '8,4' : 'none';

  // Build the arrowhead marker ID (unique per type so they don't conflict)
  const markerId = `arrow-${type}`;

  // Colors
  const colorMap = {
    inheritance: '#3498db',     // blue
    association: '#2ecc71',     // green
    aggregation: '#f39c12',     // orange
    composition: '#e74c3c',     // red
    implementation: '#9b59b6',  // purple
  };
  const color = colorMap[type] || '#888';

  // Label
  const labelMap = {
    inheritance: '▷ extends',
    association: '→ uses',
    aggregation: '◇ has',
    composition: '◆ owns',
    implementation: '▷ implements',
  };
  const label = labelMap[type] || type;

  // Midpoint for the label
  const mx = (x1 + x2) / 2;
  const my = (x1 + x2) / 2 ? (y1 + y2) / 2 - 10 : (y1 + y2) / 2;

  return (
    <g>
      {/* Define arrowhead marker */}
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          refX="10"
          refY="5"
          markerWidth="8"
          markerHeight="8"
          orient="auto-start-reverse"
        >
          {(type === 'inheritance' || type === 'implementation') ? (
            // Hollow triangle for inheritance/implementation
            <path d="M 0 0 L 10 5 L 0 10 z" fill="none" stroke={color} strokeWidth="1.5" />
          ) : (type === 'composition') ? (
            // Filled diamond for composition
            <path d="M 0 5 L 5 0 L 10 5 L 5 10 z" fill={color} stroke={color} />
          ) : (type === 'aggregation') ? (
            // Hollow diamond for aggregation
            <path d="M 0 5 L 5 0 L 10 5 L 5 10 z" fill="none" stroke={color} strokeWidth="1.5" />
          ) : (
            // Simple arrow for association
            <path d="M 0 0 L 10 5 L 0 10" fill="none" stroke={color} strokeWidth="1.5" />
          )}
        </marker>
      </defs>

      {/* The line itself */}
      <line
        x1={x1} y1={y1}
        x2={x2} y2={y2}
        stroke={color}
        strokeWidth="2"
        strokeDasharray={strokeDash}
        markerEnd={`url(#${markerId})`}
      />

      {/* Relationship label at the midpoint */}
      <text
        x={mx}
        y={(y1 + y2) / 2 - 10}
        fill={color}
        fontSize="11"
        textAnchor="middle"
        fontFamily="sans-serif"
        fontWeight="600"
      >
        {label}
      </text>
    </g>
  );
}
