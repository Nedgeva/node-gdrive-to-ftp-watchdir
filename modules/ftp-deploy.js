const FtpDeploy = require('ftp-deploy')


/*
* deploys local files to remote ftp
* watch dir
* returns fileList
*/
const deployFilesToWatchDir = config =>
  fileList =>
    new Promise((resolve, reject) => {
      const ftpDeploy = new FtpDeploy()

      const extConfig = Object.assign({}, config)
      extConfig.include.push(...fileList)
    
      ftpDeploy.deploy(extConfig, err =>
        err
          ? reject(`Error while uploading files to ftp: ${err}`)
          : resolve(fileList)
      )

      ftpDeploy.on('uploaded', data =>
        console.log(`${data.transferredFileCount} file(s) has been uploaded ...`)
      )
    })


module.exports = deployFilesToWatchDir