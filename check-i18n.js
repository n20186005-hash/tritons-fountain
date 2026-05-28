const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, 'src/messages');
const files = fs.readdirSync(messagesDir).filter(f => f.endsWith('.json'));

const getKeys = (obj, prefix = '') => {
  return Object.keys(obj).reduce((res, el) => {
    if (Array.isArray(obj[el])) {
      return res;
    } else if (typeof obj[el] === 'object' && obj[el] !== null) {
      return [...res, ...getKeys(obj[el], prefix + el + '.')];
    }
    return [...res, prefix + el];
  }, []);
};

const keysMap = {};
files.forEach(file => {
  const content = JSON.parse(fs.readFileSync(path.join(messagesDir, file), 'utf-8'));
  keysMap[file] = getKeys(content).sort();
});

const allKeys = [...new Set(Object.values(keysMap).flat())];

let hasError = false;
files.forEach(file => {
  const missing = allKeys.filter(k => !keysMap[file].includes(k));
  if (missing.length > 0) {
    console.log(`File ${file} is missing keys:`);
    missing.forEach(m => console.log(`  - ${m}`));
    hasError = true;
  }
});

if (!hasError) {
  console.log('All files have exactly the same keys. No errors found.');
}
