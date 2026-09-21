/**
 * CodeGenerator.js
 *
 * PURPOSE: Takes an array of class objects (each with a name, attributes,
 * and methods) plus an array of relationships, and produces valid Java
 * source code as a string.
 *
 * HOW IT WORKS:
 *  1. Loop through every class the user created on the canvas.
 *  2. For each class, check if any relationship targets it (e.g., inheritance).
 *  3. Build the Java class declaration, fields, constructor, and methods.
 *  4. Return all classes as one big string separated by dividers.
 */

// Map the short visibility labels to Java access modifiers
const visibilityMap = {
  '+': 'public',    // accessible from anywhere
  '-': 'private',   // accessible only inside this class
  '#': 'protected', // accessible inside this class + subclasses
  '~': ''           // package-private (default in Java — no keyword)
};

/**
 * Main function: takes the full diagram state and returns Java code
 * @param {Array} classes     - all class boxes from the canvas
 * @param {Array} relationships - all relationship arrows
 * @returns {string}          - the generated Java source code
 */
export function generateJavaCode(classes, relationships) {
  if (!classes || classes.length === 0) {
    return '// No classes to generate.\n// Add classes to the diagram first.';
  }

  const codeBlocks = classes.map((cls) => {
    return generateSingleClass(cls, classes, relationships);
  });

  return codeBlocks.join('\n\n' + '/' .repeat(50) + '\n\n');
}

/**
 * Generates Java code for one class
 */
function generateSingleClass(cls, allClasses, relationships) {
  const lines = [];
  const className = cls.name || 'UnnamedClass';

  // --- Check for inheritance / implementation relationships ---
  let extendsClause = '';
  let implementsClause = '';

  relationships.forEach((rel) => {
    if (rel.fromId === cls.id) {
      const targetClass = allClasses.find((c) => c.id === rel.toId);
      if (targetClass) {
        const targetName = targetClass.name || 'UnnamedClass';
        if (rel.type === 'inheritance') {
          extendsClause = ` extends ${targetName}`;
        } else if (rel.type === 'implementation') {
          implementsClause = ` implements ${targetName}`;
        }
      }
    }
  });

  // --- Class declaration ---
  lines.push(`public class ${className}${extendsClause}${implementsClause} {`);
  lines.push('');

  // --- Fields (from attributes) ---
  const validAttrs = (cls.attributes || []).filter((a) => a.name.trim());
  if (validAttrs.length > 0) {
    lines.push('    // ===== Fields =====');
    validAttrs.forEach((attr) => {
      const vis = visibilityMap[attr.visibility] || 'private';
      const type = attr.type || 'String';
      const name = attr.name.trim();
      lines.push(`    ${vis} ${type} ${name};`);
    });
    lines.push('');
  }

  // --- Default Constructor ---
  lines.push('    // ===== Constructor =====');
  if (validAttrs.length > 0) {
    const params = validAttrs
      .map((a) => `${a.type || 'String'} ${a.name.trim()}`)
      .join(', ');
    lines.push(`    public ${className}(${params}) {`);
    validAttrs.forEach((a) => {
      const name = a.name.trim();
      lines.push(`        this.${name} = ${name};`);
    });
    lines.push('    }');
  } else {
    lines.push(`    public ${className}() {`);
    lines.push('        // default constructor');
    lines.push('    }');
  }
  lines.push('');

  // --- Getters and Setters ---
  if (validAttrs.length > 0) {
    lines.push('    // ===== Getters & Setters =====');
    validAttrs.forEach((attr) => {
      const type = attr.type || 'String';
      const name = attr.name.trim();
      const capName = name.charAt(0).toUpperCase() + name.slice(1);

      // Getter
      lines.push(`    public ${type} get${capName}() {`);
      lines.push(`        return this.${name};`);
      lines.push('    }');
      lines.push('');

      // Setter
      lines.push(`    public void set${capName}(${type} ${name}) {`);
      lines.push(`        this.${name} = ${name};`);
      lines.push('    }');
      lines.push('');
    });
  }

  // --- Methods ---
  const validMethods = (cls.methods || []).filter((m) => m.name.trim());
  if (validMethods.length > 0) {
    lines.push('    // ===== Methods =====');
    validMethods.forEach((method) => {
      const vis = visibilityMap[method.visibility] || 'public';
      const returnType = method.returnType || 'void';
      const name = method.name.trim();
      lines.push(`    ${vis} ${returnType} ${name}() {`);
      lines.push(`        // TODO: implement ${name}`);
      lines.push('    }');
      lines.push('');
    });
  }

  // --- toString override ---
  lines.push('    @Override');
  lines.push('    public String toString() {');
  if (validAttrs.length > 0) {
    const fields = validAttrs.map((a) => `"${a.name.trim()}=" + ${a.name.trim()}`).join(' + ", " + ');
    lines.push(`        return "${className}{" + ${fields} + "}";`);
  } else {
    lines.push(`        return "${className}{}";`);
  }
  lines.push('    }');

  lines.push('}');

  return lines.join('\n');
}
