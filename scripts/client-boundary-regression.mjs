import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const config = ts.readConfigFile(path.join(root, "tsconfig.json"), ts.sys.readFile);
assert.equal(config.error, undefined, "Read tsconfig before resolving client dependencies");
const { options, errors } = ts.convertCompilerOptionsFromJson(config.config.compilerOptions, root);
assert.equal(errors.length, 0, "Resolve client dependencies using the project compiler options");
const forbidden = /^src\/data\/(?:productTaxonomy|productItems|productSearch|resourceArticles|resources|workflows|productCatalog|productNavigation)(?:\.ts$|\/)/;
const visited = new Set();
const relative = (filename) => path.relative(root, filename).split(path.sep).join("/");

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filename = path.join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(filename) : /\.[cm]?[jt]sx?$/.test(filename) ? [filename] : [];
  });
}

function sourceFile(filename, source) {
  return ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true);
}

const clientRoots = sourceFiles(path.join(root, "src")).filter((filename) =>
  sourceFile(filename, readFileSync(filename, "utf8")).statements.some((node) =>
    ts.isExpressionStatement(node) && ts.isStringLiteral(node.expression) && node.expression.text === "use client"
  )
);
assert.ok(clientRoots.length > 0, "Discover real client entry points");

function visit(filename, parents = []) {
  const chain = [...parents, relative(filename)];
  assert.ok(!forbidden.test(relative(filename)), `Full catalog/content data reached the client:\n${chain.join(" -> ")}`);
  if (visited.has(filename)) return;
  visited.add(filename);

  // Emitting first removes both explicit type imports and imports used only as types.
  const emitted = ts.transpileModule(readFileSync(filename, "utf8"), {
    fileName: filename,
    compilerOptions: { ...options, module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX }
  }).outputText;

  function follow(specifier) {
    if (!specifier.startsWith(".") && !specifier.startsWith("@/") && !path.isAbsolute(specifier)) return;
    const dependency = ts.resolveModuleName(specifier, filename, options, ts.sys).resolvedModule;
    assert.ok(dependency, `Unresolved local client dependency ${specifier} in ${relative(filename)}`);
    visit(path.resolve(dependency.resolvedFileName), chain);
  }

  function inspect(node) {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) {
      follow(node.moduleSpecifier.text);
    }
    if (ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(node.expression) && node.expression.text === "require"))) {
      const specifier = node.arguments[0];
      assert.ok(specifier && ts.isStringLiteralLike(specifier), `Cannot analyze computed import/require in ${relative(filename)}; it may load local client data`);
      follow(specifier.text);
    }
    ts.forEachChild(node, inspect);
  }
  inspect(sourceFile(`${filename}.js`, emitted));
}

clientRoots.forEach((filename) => visit(filename));
console.log(`Client boundary regression passed (${clientRoots.length} client roots; ${visited.size} runtime modules; full catalog/content data stays server-side; offline).`);
