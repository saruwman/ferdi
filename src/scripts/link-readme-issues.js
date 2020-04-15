/**
 * Script that automatically creates links to issues inside README.md
 *
 * e.g. "#123" => "[#123](https://github.com/getferdi/ferdi/issues/123)"
 * and  "franz/#123" => "[franz#123](https://github.com/meetfranz/franz/issues/123)"
 */

const fs = require('fs-extra');
const path = require('path');

console.log('Linking issues and PRs in README.md');

const readmepath = path.join(__dirname, '../../', 'README.md');

// Read README.md
let readme = fs.readFileSync(readmepath, 'utf-8');

let replacements = 0;

// Replace Ferdi issues
readme = readme.replace(/(?<!\[|franz)#\d{3}(?!\])/gi, (match) => {
  const issueNr = match.replace('#', '');
  replacements += 1;
  return `[#${issueNr}](https://github.com/getferdi/ferdi/issues/${issueNr})`;
});

// Replace Franz issues
readme = readme.replace(/(?<!\[)franz#\d{3,}(?!\])/gi, (match) => {
  const issueNr = match.replace('#', '');
  replacements += 1;
  return `[franz#${issueNr}](https://github.com/meetfranz/franz/issues/${issueNr})`;
});

// Write to file
fs.writeFileSync(readmepath, readme);

console.log(`Added ${replacements} links`);
