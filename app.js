const Promise = require('bluebird')
const boot = require('./modules/auth')
const removeLocalFiles = require('./modules/local-fs')
const deployFilesToWatchDir = require('./modules/ftp-deploy')
const fleepPostHook = require('./modules/fleep-ack')

const {
  getFolderId,
  listFilesInFolder,
  loadGDriveFiles,
  removeGDriveFiles
} = require('./modules/gdrive')

const ftpConfig = require('./.credentials/ftp-credentials')

const fleepHookId = 'VyPAI1lBRGy0BL1VCm1X-g'

/*
* simply passes gDrive folder name
* down to promise chain
*/
const start = folderName =>
  Promise.resolve(folderName)

/*
* restarts app after specific amount of time
*/
const restart = ms =>
  setTimeout(boot, ms, appStart)

const appStart = auth =>
  start('torrent')
    .then(getFolderId(auth))
    .then(listFilesInFolder(auth))
    .then(loadGDriveFiles(auth))
    .then(removeGDriveFiles(auth))
    .then(deployFilesToWatchDir(ftpConfig))
    .then(removeLocalFiles)
    .then(fleepPostHook(fleepHookId))
    .catch(console.error)
    .finally(restart(5000))

boot(appStart)