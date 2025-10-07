import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, "..", "dist");

function fixImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");
  let hasChanges = false;

  // Fix relative imports that don't have .js extension
  const originalContent = content;
  
  content = content
    // Fix imports like: from "./path" or from "../path" 
    .replace(
      /from\s+["'](\.\/?(?:\.\.\/)*[^"']*?)["']/g,
      (match, importPath) => {
        // Skip if already has extension
        if (importPath.endsWith(".js") || importPath.endsWith(".json")) {
          return match;
        }
        // Add .js extension
        hasChanges = true;
        return match.replace(importPath, importPath + ".js");
      }
    )
    // Fix import statements with relative paths
    .replace(
      /import\s+(.*?)\s+from\s+["'](\.\/?(?:\.\.\/)*[^"']*?)["']/g,
      (match, imports, importPath) => {
        if (importPath.endsWith(".js") || importPath.endsWith(".json")) {
          return match;
        }
        hasChanges = true;
        return `import ${imports} from "${importPath}.js"`;
      }
    )
    // Fix path alias imports (@/...)
    .replace(
      /from\s+["']@\/([^"']*?)["']/g,
      (match, importPath) => {
        // Calculate relative path from current file to the target
        const currentDir = path.dirname(filePath);
        const targetPath = path.join(distDir, importPath);
        let relativePath = path.relative(currentDir, targetPath);
        
        // Normalize path separators for cross-platform compatibility
        relativePath = relativePath.replace(/\\/g, '/');
        
        // Ensure it starts with ./ if it's not going up directories
        if (!relativePath.startsWith('../') && !relativePath.startsWith('./')) {
          relativePath = './' + relativePath;
        }
        
        // Add .js extension if not present
        if (!relativePath.endsWith(".js") && !relativePath.endsWith(".json")) {
          relativePath += ".js";
        }
        
        hasChanges = true;
        return `from "${relativePath}"`;
      }
    )
    // Fix import statements with path aliases
    .replace(
      /import\s+(.*?)\s+from\s+["']@\/([^"']*?)["']/g,
      (match, imports, importPath) => {
        const currentDir = path.dirname(filePath);
        const targetPath = path.join(distDir, importPath);
        let relativePath = path.relative(currentDir, targetPath);
        
        // Normalize path separators
        relativePath = relativePath.replace(/\\/g, '/');
        
        // Ensure proper relative path format
        if (!relativePath.startsWith('../') && !relativePath.startsWith('./')) {
          relativePath = './' + relativePath;
        }
        
        // Add .js extension
        if (!relativePath.endsWith(".js") && !relativePath.endsWith(".json")) {
          relativePath += ".js";
        }
        
        hasChanges = true;
        return `import ${imports} from "${relativePath}"`;
      }
    )
    // Fix dynamic imports
    .replace(
      /import\(["'](\.\/?(?:\.\.\/)*[^"']*?)["']\)/g,
      (match, importPath) => {
        if (importPath.endsWith(".js") || importPath.endsWith(".json")) {
          return match;
        }
        hasChanges = true;
        return match.replace(importPath, importPath + ".js");
      }
    );

  if (hasChanges) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed imports in: ${path.relative(distDir, filePath)}`);
  }
}

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDirectory(filePath);
    } else if (file.endsWith(".js")) {
      fixImportsInFile(filePath);
    }
  }
}

console.log("Fixing import statements in compiled JavaScript files...");
walkDirectory(distDir);
console.log("Import fixing completed!");