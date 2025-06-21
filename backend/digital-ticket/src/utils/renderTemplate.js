// utils/renderTemplate.js
const fs = require('fs');
const path = require('path');

const cache = {};

function renderTemplate(name, data = {}) {
  if (!cache[name]) {
    const filePath = path.join(__dirname, '..', 'templates', `${name}.html`);
    cache[name] = fs.readFileSync(filePath, 'utf8');
  }
  let tpl = cache[name];
  // Replace [key] whenever key is in data
  Object.entries(data).forEach(([key, val]) => {
    tpl = tpl.replace(new RegExp(`\\[${key}\\]`, 'g'), val);
  });
  return tpl;
}

module.exports = { renderTemplate };
