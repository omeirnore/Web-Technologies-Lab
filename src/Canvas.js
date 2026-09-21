/**
 * Canvas.js
 *
 * PURPOSE: The main drawing area where UML class boxes are placed.
 * It handles:
 *   1. Rendering all ClassBox components at their (x, y) positions.
 *   2. Rendering all RelationshipLine SVG arrows.
 *   3. Drag-and-drop — when the user grabs a class box and moves it.
 *   4. "Relate mode" — when the user is clicking two classes to connect them.
 *
 * PROPS:
 *   classes          - array of all class objects
 *   relationships    - array of all relationship objects
 *   selectedId       - ID of the currently selected class (or null)
 *   relateMode       - boolean, is the user in "add relationship" mode?
 *   relateFrom       - when in relate mode, the ID of the first selected class
 *   onUpdateClass    - callback to update a class's data
 *   onSelectClass    - callback when a class is clicked
 *   onMoveClass      - callback to update a class's (x, y) position
 */
import React, { useRef, useCallback } from 'react';
import ClassBox from './ClassBox';
import RelationshipLine from './RelationshipLine';

export default function Canvas({
  classes,
  relationships,
  selectedId,
  relateMode,
  relateFrom,
  onUpdateClass,
  onSelectClass,
  onMoveClass
}) {
  // We use a ref to track whether the user is currently dragging
  const dragInfo = useRef(null);

  // --- DRAG START ---
  // Called when user presses mouse down on a class box
  const handleMouseDown = useCallback((e, classId) => {
    e.preventDefault();
    const cls = classes.find((c) => c.id === classId);
    if (!cls) return;

    // Record the offset between mouse position and box position
    // so the box doesn't "jump" to the cursor
    dragInfo.current = {
      classId,
      offsetX: e.clientX - cls.x,
      offsetY: e.clientY - cls.y
    };
  }, [classes]);

  // --- DRAG MOVE ---
  const handleMouseMove = useCallback((e) => {
    if (!dragInfo.current) return;
    const { classId, offsetX, offsetY } = dragInfo.current;
    const newX = e.clientX - offsetX;
    const newY = e.clientY - offsetY;
    onMoveClass(classId, newX, newY);
  }, [onMoveClass]);

  // --- DRAG END ---
  const handleMouseUp = useCallback(() => {
    dragInfo.current = null;
  }, []);

  return (
    <div
      className="canvas-area"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Show a banner when in relationship mode */}
      {relateMode && (
        <div className="relate-mode-banner">
          {relateFrom
            ? '🔗 Now click the SECOND class (target)'
            : '🔗 Click the FIRST class (source)'}
        </div>
      )}

      {/* SVG layer for relationship arrows */}
      <svg className="relationships-svg">
        {relationships.map((rel, index) => {
          const fromCls = classes.find((c) => c.id === rel.fromId);
          const toCls = classes.find((c) => c.id === rel.toId);
          return (
            <RelationshipLine
              key={index}
              fromClass={fromCls}
              toClass={toCls}
              type={rel.type}
            />
          );
        })}
      </svg>

      {/* Render all class boxes */}
      {classes.map((cls) => (
        <ClassBox
          key={cls.id}
          data={cls}
          isSelected={cls.id === selectedId}
          onUpdate={onUpdateClass}
          onMouseDown={handleMouseDown}
          onClick={onSelectClass}
        />
      ))}
    </div>
  );
}
