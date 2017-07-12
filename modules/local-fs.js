const fs = require('fs')

/*
* remove individual file on local fs
*/
const removeFile = fileName =>
  new Promise((resolve, reject) => {
    fs.unlink(`./download/${fileName}`, err =>
      err
        ? reject(`Error while trying to remove ${fileName}: ${err}`)
        : resolve(`${fileName} successfully removed`)
    )
  })

/*
* remove all local files in row
*/
const removeLocalFiles = fileList => {
  const promiseList = fileList
    .map(removeFile)

  return Promise.all(promiseList)
    .then(() => fileList)
}

module.exports = removeLocalFiles