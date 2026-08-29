const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'content', 'products');
const files = fs.readdirSync(dir);

files.forEach(file => {
    if (file.endsWith('.json')) {
        const filepath = path.join(dir, file);
        const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
        data.negotiable = true;
        fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
    }
});
console.log('Done updating products.');
