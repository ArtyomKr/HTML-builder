const path = require('path');
const fsPromises = require('fs').promises;

const resultFolder = path.join(__dirname, 'project-dist');
const componentsFolder = path.join(__dirname, 'components');
const stylesFolder = path.join(__dirname, 'styles');
const assetsFolder = path.join(__dirname, 'assets');

async function updateHTML(templatePath, componentsFolder, targetFile = `${__dirname}\\index.html`) {
  const template = await fsPromises.readFile(templatePath);
  const tags = template.toString().match(/(?<={{)\w+/gm);

  new Promise(async resolve => {
    let replacedHTML = template;
    for (const tag of tags) {
      const file = await fsPromises.readFile(`${componentsFolder}\\${tag}.html`).catch(() => '');
      const reg = new RegExp(`{{${tag}}}`, 'gm');

      replacedHTML = replacedHTML.toString().replace(reg, `\n${file.toString()}\n`);
    }
    resolve(replacedHTML) ;
  })
    .then(html => {
      fsPromises.writeFile(targetFile, html);
      console.log('HTML file updated');
    });
}

async function bundleCss(stylesFolder, targetFile = `${__dirname}\\style.css`) {
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
    console.log(`Successfully merged ${bundle.length} css files`);
    fsPromises.writeFile( targetFile, bundle.join('\n'));
  });
}

async function copyFolder(folderToCopy, targetFolder) {
  await fsPromises.mkdir(targetFolder, { recursive: true }).catch(() => {});

  fsPromises.readdir(folderToCopy).then(files => {
    fsPromises.readdir(targetFolder).then(copiedFiles => {
      copiedFiles.forEach(copiedFile => {
        const fileExists = files.includes(copiedFile);
        if (!fileExists) fsPromises.unlink(`${targetFolder}\\${copiedFile}`);
      });
    });

    files.forEach(async file => {
      let mTimeCopied =  await fsPromises.stat(`${targetFolder}\\${file}`)
        .then(stats => stats.mtimeMs)
        .catch(() => null);
      let mTimeOriginal = await fsPromises.stat(`${folderToCopy}\\${file}`).then(stats => stats.mtimeMs);

      if (mTimeOriginal !== mTimeCopied) {
        console.log(`Copied file: ${file}`);
        fsPromises.copyFile(`${folderToCopy}\\${file}`, `${targetFolder}\\${file}`)
          .catch(err => console.log(err));
      }
    });
  });
}



updateHTML(`${__dirname}\\template.html`, componentsFolder, `${resultFolder}//index.html`);
bundleCss(stylesFolder, `${resultFolder}//style.css`);
copyFolder(`${assetsFolder}\\fonts`, `${resultFolder}\\assets\\fonts`);
copyFolder(`${assetsFolder}\\img`, `${resultFolder}\\assets\\img`);
copyFolder(`${assetsFolder}\\svg`, `${resultFolder}\\assets\\svg`);
