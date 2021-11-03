const path = require('path');
const fsPromises = require('fs').promises;

const folderToCopy = path.join(__dirname, 'files');
const copiedFolder = path.join(__dirname, 'files-copy');

fsPromises.mkdir(copiedFolder).then(() => {
  console.log('Directory created successfully');
}).catch(() => {});

fsPromises.readdir(folderToCopy).then(files => {
  //deleting files that were deleted in original folder
  fsPromises.readdir(copiedFolder).then(copiedFiles => {
    copiedFiles.forEach(copiedFile => {
      const fileExists = files.includes(copiedFile);
      if (!fileExists) fsPromises.unlink(`${copiedFolder}\\${copiedFile}`);
    });
  });

  files.forEach(async file => {
    //checking last time when files were modified
    let mTimeCopied =  await fsPromises.stat(`${copiedFolder}\\${file}`)
      .then(stats => stats.mtimeMs)
      .catch(() => null); //if file is new
    let mTimeOriginal = await fsPromises.stat(`${folderToCopy}\\${file}`).then(stats => stats.mtimeMs);

    //files are copying only if they were modified
    if (mTimeOriginal !== mTimeCopied) {
      fsPromises.copyFile(`${folderToCopy}\\${file}`, `${copiedFolder}\\${file}`)
        .catch(err => console.log(err));
    }
  });
});