const request = require('request')


/*
* post message to Fleep conversation
*/
const fleepPostHook = hookId =>
  fileList => {

    const fileListString = fileList
      .join('\n')

    const message = `Successfully added following torrents : \n:::\n${fileListString}`

    const options = {
      method: 'POST',
      uri: `https://fleep.io/hook/${hookId}`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.87 Safari/537.36'
      },
      body: {
        message
      },
      json: true
    }

    request(options)
  }


module.exports = fleepPostHook