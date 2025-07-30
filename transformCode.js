const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const t = require("@babel/types");

function transformLogStatements(code) {
  const ast = parser.parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  traverse(ast, {
    CallExpression(path) {
      const callee = path.node.callee;
      const isTopLevelLog =
        t.isIdentifier(callee, { name: "log" }) &&
        path.parent.type === "ExpressionStatement";

      if (!isTopLevelLog) return;

      const scopeVars = Object.keys(path.scope.bindings);

      const props = scopeVars.map((v) =>
        t.objectProperty(t.stringLiteral(v), t.identifier(v))
      );

      const newNode = t.callExpression(
        t.memberExpression(t.identifier("console"), t.identifier("log")),
        [t.objectExpression(props)]
      );

      path.replaceWith(newNode);
    },
  });

  return generator(ast).code;
}

module.exports = { transformLogStatements };
