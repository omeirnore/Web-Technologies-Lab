/**
 * ClassBox.js
 *
 * PURPOSE: Renders ONE UML class box on the canvas.
 * Each box has three sections (just like a real UML class diagram):
 *   1. Header   — the class name (e.g., "Student")
 *   2. Middle   — attributes / fields (e.g., "- name : String")
 *   3. Bottom   — methods (e.g., "+ getName() : String")
 *
 * The box is DRAGGABLE — the user can click and move it around the canvas.
 * The user can also click inside the inputs to edit the name, add attributes, etc.
 *
 * PROPS:
 *   data          — the class object { id, name, x, y, attributes, methods }
 *   isSelected    — boolean, is this box currently selected?
 *   onUpdate      — callback to update this class's data in the parent state
 *   onMouseDown   — callback when user starts dragging
 *   onClick       — callback when user clicks (for selection / relationship mode)
 */
import React from 'react';

export default function ClassBox({ data, isSelected, onUpdate, onMouseDown, onClick }) {

  // ---- ATTRIBUTE HANDLERS ----
  // These functions let the user add, edit, or remove attribute rows.

  const addAttribute = () => {
    // Add a new blank attribute to the list
    const updated = {
      ...data,
      attributes: [
        ...data.attributes,
        { visibility: '-', type: 'String', name: '' }
        // visibility '-' means private by default, type defaults to String
      ]
    };
    onUpdate(updated);
  };

  const updateAttribute = (index, field, value) => {
    // Update one specific field of one attribute
    const attrs = [...data.attributes];
    attrs[index] = { ...attrs[index], [field]: value };
    onUpdate({ ...data, attributes: attrs });
  };

  const removeAttribute = (index) => {
    const attrs = data.attributes.filter((_, i) => i !== index);
    onUpdate({ ...data, attributes: attrs });
  };

  // ---- METHOD HANDLERS ----
  // Same idea as attributes, but for methods.

  const addMethod = () => {
    const updated = {
      ...data,
      methods: [
        ...data.methods,
        { visibility: '+', returnType: 'void', name: '' }
        // visibility '+' means public by default, return type defaults to void
      ]
    };
    onUpdate(updated);
  };

  const updateMethod = (index, field, value) => {
    const methods = [...data.methods];
    methods[index] = { ...methods[index], [field]: value };
    onUpdate({ ...data, methods: methods });
  };

  const removeMethod = (index) => {
    const methods = data.methods.filter((_, i) => i !== index);
    onUpdate({ ...data, methods: methods });
  };

  return (
    <div
      className={`class-box ${isSelected ? 'selected' : ''}`}
      style={{ left: data.x, top: data.y }}
      onMouseDown={(e) => {
        // Only start dragging if user clicks the box itself, not an input
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'SELECT') {
          onMouseDown(e, data.id);
        }
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(data.id);
      }}
    >
      {/* ===== SECTION 1: Class Name Header ===== */}
      <div className="class-box-header">
        <input
          type="text"
          value={data.name}
          placeholder="ClassName"
          onChange={(e) => onUpdate({ ...data, name: e.target.value })}
          onMouseDown={(e) => e.stopPropagation()}
        />
      </div>

      {/* ===== SECTION 2: Attributes (Fields) ===== */}
      <div className="class-box-section">
        <div className="class-box-section-label">Attributes</div>
        {data.attributes.map((attr, i) => (
          <div key={i} className="attribute-row">
            {/* Visibility dropdown: +, -, #, ~ */}
            <select
              value={attr.visibility}
              onChange={(e) => updateAttribute(i, 'visibility', e.target.value)}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <option value="+">+</option>
              <option value="-">−</option>
              <option value="#">#</option>
              <option value="~">~</option>
            </select>
            {/* Data type input */}
            <input
              type="text"
              value={attr.type}
              placeholder="Type"
              style={{ width: '60px', flex: 'none' }}
              onChange={(e) => updateAttribute(i, 'type', e.target.value)}
              onMouseDown={(e) => e.stopPropagation()}
            />
            {/* Attribute name input */}
            <input
              type="text"
              value={attr.name}
              placeholder="name"
              onChange={(e) => updateAttribute(i, 'name', e.target.value)}
              onMouseDown={(e) => e.stopPropagation()}
            />
            {/* Delete this attribute */}
            <button className="btn-remove-row" onClick={() => removeAttribute(i)}>✕</button>
          </div>
        ))}
        <button className="btn-add-row" onClick={addAttribute}>+ Add Attribute</button>
      </div>

      {/* ===== SECTION 3: Methods ===== */}
      <div className="class-box-section">
        <div className="class-box-section-label">Methods</div>
        {data.methods.map((method, i) => (
          <div key={i} className="method-row">
            {/* Visibility dropdown */}
            <select
              value={method.visibility}
              onChange={(e) => updateMethod(i, 'visibility', e.target.value)}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <option value="+">+</option>
              <option value="-">−</option>
              <option value="#">#</option>
              <option value="~">~</option>
            </select>
            {/* Return type */}
            <input
              type="text"
              value={method.returnType}
              placeholder="void"
              style={{ width: '50px', flex: 'none' }}
              onChange={(e) => updateMethod(i, 'returnType', e.target.value)}
              onMouseDown={(e) => e.stopPropagation()}
            />
            {/* Method name */}
            <input
              type="text"
              value={method.name}
              placeholder="methodName"
              onChange={(e) => updateMethod(i, 'name', e.target.value)}
              onMouseDown={(e) => e.stopPropagation()}
            />
            <button className="btn-remove-row" onClick={() => removeMethod(i)}>✕</button>
          </div>
        ))}
        <button className="btn-add-row" onClick={addMethod}>+ Add Method</button>
      </div>
    </div>
  );
}
