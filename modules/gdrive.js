const fs = require('fs')
const gDrive = require('googleapis').drive('v3')

/* 
* load individual file
*/
const loadFile = auth =>
  fileObj =>
    new Promise((resolve, reject) => {
      const dest = fs.createWriteStream(`./download/${fileObj.name}`)

      gDrive.files.get({
        auth: auth,
        fileId: fileObj.id,
        alt: 'media'
      })
      .on('end', () =>
        resolve()
      )
      .on('error', err =>
        reject('Error during download: ' + err)
      )
      .pipe(dest)
    })

/* 
* remove individual file
*/
const removeFile = auth =>
  fileObj =>
    new Promise((resolve, reject) => {
      gDrive.files.delete({
        auth: auth,
        fileId: fileObj.id,
      }, err =>
        err
          ? reject('The API returned an error: ' + err)
          : resolve(`${fileObj.name} has been removed`)
      )
    })

/* 
* return folder id 
*/
const getFolderId = auth =>
  folderName =>
    new Promise((resolve, reject) => {
      gDrive.files.list({
        auth: auth,
        q: `name = "${folderName}" and mimeType = "application/vnd.google-apps.folder"`,
        fields: "nextPageToken, files(id, name)"
      }, (err, res) =>
        err
          ? reject('The API returned an error: ' + err)
          : resolve(res.files[0].id)
      )
    })
  
/* 
* return list of all torrent files under specified folder 
*/
const listFilesInFolder = auth =>
  folderId =>
    new Promise((resolve, reject) => {
      gDrive.files.list({
        auth: auth,
        q: `mimeType = "application/x-bittorrent" and trashed = false and "${folderId}" in parents`,
        fields: "nextPageToken, files(id, name)"
      }, (err, res) =>
        err
          ? reject('The API returned an error: ' + err)
          : resolve(res.files)
      )
    })

/* 
* download files from gdrive 
* returns gdrive file list
*/
const loadGDriveFiles = auth =>
  fileList => {
    if (fileList.length === 0)
      return Promise.reject('No files in folder, aborting...')

    const promiseList = fileList
      .map(loadFile(auth))

    return Promise.all(promiseList)
      .then(() => fileList)
  }

/*
* remove files after download
* returns filename list
*/
const removeGDriveFiles = auth =>
  fileList => {
    const promiseList = fileList
      .map(removeFile(auth))

    const fileNameList = fileList
      .map(fileObj => fileObj.name)

    return Promise.all(promiseList)
      .then(() => fileNameList)
  }

// export all lib functions
module.exports = {
  getFolderId,
  listFilesInFolder,
  loadGDriveFiles,
  removeGDriveFiles
}