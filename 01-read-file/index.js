const path = require('path');
const fs = require('fs');

const textPath = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(textPath);
let data = '';

stream.on('data', (chunk) => {
  data += chunk;
});

stream.on('end', () => {
  console.log(data);
});