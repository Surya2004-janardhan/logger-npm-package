const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const t = require("@babel/types");

function transformCode(code) {
  const ast = parser.parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  traverse(ast, {
    CallExpression(path) {
      if (
        path.node.callee.name === "log" &&
        path.parent.type === "ExpressionStatement"
      ) {
        const logNodeIndex = path.key;

        // Step 1: Collect local variable names in this block before this log
        let blockScope = path.findParent(
          (p) => p.isFunction() || p.isProgram() || p.isBlockStatement()
        );

        const declaredBeforeLog = [];
        const statements = blockScope.node.body || [];

        for (const stmt of statements) {
          if (stmt === path.parentPath.node) break;

          if (t.isVariableDeclaration(stmt)) {
            for (const decl of stmt.declarations) {
              if (t.isIdentifier(decl.id)) {
                declaredBeforeLog.push(decl.id.name);
              }
            }
          }

          if (t.isFunctionDeclaration(stmt)) {
            declaredBeforeLog.push(stmt.id.name);
          }
        }

        // Step 2: Create object expression with only the collected identifiers
        const properties = declaredBeforeLog.map((v) =>
          t.objectProperty(t.stringLiteral(v), t.identifier(v))
        );

        path.replaceWith(
          t.callExpression(
            t.memberExpression(t.identifier("console"), t.identifier("log")),
            [t.objectExpression(properties)]
          )
        );
      }
    },
  });

  return generator(ast).code;
}

module.exports = { transformCode };
