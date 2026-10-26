/**
 * App.js — THE MAIN COMPONENT
 *
 * PURPOSE: This is the "brain" of the entire application.
 * It manages ALL the state (classes, relationships, selected class, etc.)
 * and renders three main pieces:
 *   1. Toolbar    — buttons to add class, add relationship, generate code, delete
 *   2. Canvas     — the visual drawing area (left side)
 *   3. Code Panel — shows the generated Java code (right side)
 *
 * STATE EXPLAINED:
 *   classes        — array of class objects. Each has:
 *                     { id, name, x, y, attributes: [...], methods: [...] }
 *   relationships  — array of relationship objects. Each has:
 *                     { fromId, toId, type }
 *   selectedId     — the ID of the class currently clicked/highlighted
 *   generatedCode  — string of the generated Java code
 *   relateMode     — boolean: are we in "add relationship" mode?
 *   relateFrom     — when adding a relationship, the ID of the first class clicked
 *   showPicker     — object with { x, y } to show relationship type picker popup
 */
import React, { useState, useCallback } from 'react';
import Canvas from './Canvas';
import { generateJavaCode } from './CodeGenerator';
import './App.css';

// Helper: create a unique ID for each class box
let nextId = 1;
function makeId() {
  return `class_${nextId++}`;
}

function App() {
  // ===== STATE =====
  const [classes, setClasses] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [relateMode, setRelateMode] = useState(false);
  const [relateFrom, setRelateFrom] = useState(null);
  const [showPicker, setShowPicker] = useState(null); // { x, y } or null

  // ===== ADD A NEW CLASS =====
  // Creates a new blank class box at a random position
  const addClass = () => {
    const newClass = {
      id: makeId(),
      name: '',
      x: 50 + Math.random() * 300,   // random horizontal position
      y: 50 + Math.random() * 200,    // random vertical position
      attributes: [],
      methods: []
    };
    setClasses((prev) => [...prev, newClass]);
  };

  // ===== UPDATE A CLASS =====
  // Called when user edits the name, adds an attribute, etc.
  const updateClass = useCallback((updatedClass) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === updatedClass.id ? updatedClass : c))
    );
  }, []);

  // ===== MOVE A CLASS (drag) =====
  const moveClass = useCallback((classId, newX, newY) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === classId ? { ...c, x: newX, y: newY } : c))
    );
  }, []);

  // ===== DELETE SELECTED CLASS =====
  const deleteSelected = () => {
    if (!selectedId) return;
    setClasses((prev) => prev.filter((c) => c.id !== selectedId));
    // Also remove any relationships connected to the deleted class
    setRelationships((prev) =>
      prev.filter((r) => r.fromId !== selectedId && r.toId !== selectedId)
    );
    setSelectedId(null);
  };

  // ===== SELECT / RELATE HANDLER =====
  // When a class is clicked, it either selects it OR (if in relate mode)
  // picks it as part of a relationship pair.
  const handleSelectClass = useCallback((classId) => {
    if (!relateMode) {
      // Normal mode: just select/deselect
      setSelectedId((prev) => (prev === classId ? null : classId));
      return;
    }

    // Relate mode:
    if (!relateFrom) {
      // First click — pick the source class
      setRelateFrom(classId);
    } else if (relateFrom !== classId) {
      // Second click — show the relationship type picker popup
      setShowPicker({ fromId: relateFrom, toId: classId, x: 400, y: 100 });
    }
  }, [relateMode, relateFrom]);

  // ===== FINISH CREATING A RELATIONSHIP =====
  const finishRelationship = (type) => {
    if (showPicker) {
      setRelationships((prev) => [
        ...prev,
        { fromId: showPicker.fromId, toId: showPicker.toId, type }
      ]);
    }
    // Reset relate mode state
    setShowPicker(null);
    setRelateFrom(null);
    setRelateMode(false);
  };

  // ===== GENERATE CODE =====
  const handleGenerate = () => {
    const code = generateJavaCode(classes, relationships);
    setGeneratedCode(code);
  };

  // ===== COPY CODE TO CLIPBOARD =====
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
  };

  return (
    <div className="app">
      {/* ========== TOOLBAR ========== */}
      <div className="toolbar">
        <h1>📐 UML Class Diagram Generator</h1>
        <span style={{
          color: '#6b7280',
          fontSize: '11px',
          marginRight: '12px',
          borderLeft: '1px solid #333',
          paddingLeft: '12px',
          lineHeight: '1.4',
          letterSpacing: '0.3px'
        }}>
          Omeir Nore &nbsp;·&nbsp; Roll 61 &nbsp;·&nbsp; PRN 12414006
        </span>
        <button className="btn-add" onClick={addClass}>
          ＋ Add Class
        </button>
        <button
          className="btn-relate"
          onClick={() => {
            setRelateMode(!relateMode);
            setRelateFrom(null);
            setShowPicker(null);
          }}
        >
          {relateMode ? '✕ Cancel' : '🔗 Add Relationship'}
        </button>
        <button className="btn-generate" onClick={handleGenerate}>
          ⚡ Generate Java Code
        </button>
        {selectedId && (
          <button className="btn-delete" onClick={deleteSelected}>
            🗑 Delete Selected
          </button>
        )}
        <span className="status">
          {classes.length} class{classes.length !== 1 ? 'es' : ''} ·{' '}
          {relationships.length} relationship{relationships.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* ========== MAIN CONTENT ========== */}
      <div className="main-content">
        {/* Left side: Canvas */}
        <Canvas
          classes={classes}
          relationships={relationships}
          selectedId={selectedId}
          relateMode={relateMode}
          relateFrom={relateFrom}
          onUpdateClass={updateClass}
          onSelectClass={handleSelectClass}
          onMoveClass={moveClass}
        />

        {/* Relationship type picker popup */}
        {showPicker && (
          <div
            className="relation-picker"
            style={{ left: showPicker.x, top: showPicker.y }}
          >
            <button onClick={() => finishRelationship('inheritance')}>
              ▷ Inheritance (extends)
            </button>
            <button onClick={() => finishRelationship('implementation')}>
              ▷ Implementation (implements)
            </button>
            <button onClick={() => finishRelationship('association')}>
              → Association (uses)
            </button>
            <button onClick={() => finishRelationship('aggregation')}>
              ◇ Aggregation (has-a)
            </button>
            <button onClick={() => finishRelationship('composition')}>
              ◆ Composition (owns-a)
            </button>
          </div>
        )}

        {/* Right side: Generated Java Code Panel */}
        <div className="code-panel">
          <div className="code-panel-header">
            <h2>☕ Generated Java Code</h2>
            {generatedCode && (
              <button className="btn-copy" onClick={handleCopy}>
                📋 Copy
              </button>
            )}
          </div>
          <div className="code-output">
            {generatedCode ? (
              generatedCode
            ) : (
              <div className="empty-state">
                Add classes to the diagram,<br />
                then click "Generate Java Code"<br />
                to see your code here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
