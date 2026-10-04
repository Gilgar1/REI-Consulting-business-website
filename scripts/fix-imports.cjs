const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'Client', 'src', 'components', 'ui');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Match from "@scoped/package@version" or "package@version"
  const regex = /from\s+["'](@?[a-zA-Z0-9_\-\.\/]+)@[0-9][a-zA-Z0-9_\-\.\+]*["']/g;
  const newContent = content.replace(regex, (match, pkg) => `from "${pkg}"`);

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Cleaned imports in ${file}`);
  }
}
