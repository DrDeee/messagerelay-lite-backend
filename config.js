const fs = require('fs')

const STANDART_CONFIG = {
    port: 80,
    authToken: 'blablabla',
    publicKeyFile: 'key.pub',
    databaseDirectory: 'db'
}

if (!fs.existsSync('config.json')) {
    fs.writeFileSync('config.json', JSON.stringify(STANDART_CONFIG, null, 2), {
        encoding: 'utf8'
    })
}

module.exports = JSON.parse(fs.readFileSync('config.json', { encoding: 'utf8' }))