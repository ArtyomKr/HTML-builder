const path = require('path');
const fs = require('fs');

const folderPath = path.join(__dirname, 'secret-folder');
fs.readdir(folderPath, {withFileTypes: true}, (err, data) => {
  data.forEach((file) => {
    if (file.isFile()){
      const name = path.parse(file.name).name;
      const ext = path.parse(file.name).ext.slice(1);
      const filePath = path.join(folderPath, file.name);

      fs.stat(filePath, (err, stats) => {
        const size = ((stats.size / 1024).toFixed(3) +' kb');
        console.log(`${name} - ${ext} - ${size}`)
      });
    }
  });
});