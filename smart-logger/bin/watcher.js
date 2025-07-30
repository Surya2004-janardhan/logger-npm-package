// const chokidar = require("chokidar");
// const fs = require("fs");
// const path = require("path");
// const { transformCode } = require("../src/transformer");
// console.log("test the test");
// chokidar
//   .watch("./test", { ignored: /(^|[\/\\])\../, persistent: true })
//   .on("change", (filePath) => {
//     if (!/\.(js|ts|jsx|tsx)$/.test(filePath)) return;

//     console.log("📦 Detected:", filePath);
//     const code = fs.readFileSync(filePath, "utf-8");
//     const transformed = transformCode(code);
//     fs.writeFileSync(filePath, transformed);
//     console.log(`✅ Transformed ${path.basename(filePath)}`);
//   });
// #!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const transform = require("../lib/transformer");

const watchPath = process.cwd(); // user's project root

console.log("👀 Watching for file changes in", watchPath);

chokidar.watch("**/*.js", {
  ignored: /node_modules|\.git/,
  persistent: true
}).on("change", async (filePath) => {
  const fullPath = path.join(watchPath, filePath);
  const code = fs.readFileSync(fullPath, "utf-8");
  const output = transform(code);
  if (output !== code) {
    fs.writeFileSync(fullPath, output);
    console.log(`✅ Updated ${filePath}`);
  }
});
