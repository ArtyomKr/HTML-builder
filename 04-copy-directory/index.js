const path = require('path');
const fsPromises = require('fs').promises;

const folderToCopy = path.join(__dirname, 'files');
const copiedFolder = path.join(__dirname, 'files-copy');


fsPromises.mkdir(copiedFolder).then(() => {
  console.log('Directory created successfully');
}).catch(() => {
  console.log('Directory already exists');
});

fsPromises.readdir(folderToCopy).then(files => {
  files.forEach(async file => {
    fsPromises.copyFile(`${folderToCopy}\\${file}`, `${copiedFolder}\\${file}`)
      .catch(err => console.log(err))
  });
});