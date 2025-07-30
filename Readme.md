# LogScope

**LogScope** is a developer-friendly VS Code extension that automatically transforms `log()` calls into detailed `console.log()` statements showing all in-scope variables. Ideal for debugging quickly without writing verbose log statements manually.

---

## ✨ Features

- Automatically transforms `log()` into:
  ```js
  console.log({ var1, var2, ... });
  ```

📸 Example
Before:

function calculate(a, b) {
let sum = a + b;
log(); // Developer's shortcut
}
After:

function calculate(a, b) {
let sum = a + b;
console.log({ a, b, sum });
}
