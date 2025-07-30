const vscode = require("vscode");
const path = require("path");
const { transformLogStatements } = require("./transformCode");

function activate(context) {
  vscode.workspace.onWillSaveTextDocument(async (event) => {
    const document = event.document;
    if (!["javascript", "typescript"].includes(document.languageId)) return;

    const code = document.getText();
    const transformed = transformLogStatements(code);
    if (code === transformed) return;

    const fullRange = new vscode.Range(
      document.positionAt(0),
      document.positionAt(code.length)
    );

    const edit = new vscode.WorkspaceEdit();
    edit.replace(document.uri, fullRange, transformed);
    await vscode.workspace.applyEdit(edit);
  });
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
