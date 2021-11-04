const path = require('path');
const fsPromises = require('fs').promises;

const stylesFolder = path.join(__dirname, 'styles');
const destinationFolder = path.join(__dirname, 'project-dist');

fsPromises.readdir(stylesFolder, {withFileTypes: true}).then(async files => {
  return new Promise (async resolve => {
    const cssFiles = files.filter(file => (file.isFile() && path.parse(file.name).ext === '.css'));
    const bundle = [];

    if (!cssFiles.length) resolve([]);
    for (const file of cssFiles) {
      const data = await fsPromises.readFile(`${stylesFolder}\\${file.name}`);
      bundle.push(data.toString());

      if (bundle.length === cssFiles.length) resolve(bundle);
    }
  });
}).then(bundle => {
  console.log(`Successfully merged ${bundle.length} items`);
  fsPromises.writeFile(`${destinationFolder}\\bundle.css`, bundle.join('\n'))
});