const path = require('path');
const fs = require('fs');
const process = require('process');
const readline = require('readline');

const textPath = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(textPath);
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Type text to write it in the file');
writeStream.write('');

rl.on('line', (line) => {
  const string = line;
  if (line === 'exit') process.exit();
  writeStream.write(string + '\n');
});

process.on('exit', () => {
  console.log('Goodbye!');
  writeStream.end();
});