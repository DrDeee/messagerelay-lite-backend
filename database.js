const loki = require('lokijs')
const lfsa = require('lokijs/src/loki-fs-structured-adapter')

const fs = require('fs')

const config = require('./config')

let db
let msgs
module.exports = {
    init() {
        if (fs.existsSync(config.databaseDirectory)) {
            const stats = fs.statSync(config.databaseDirectory)
            if (!stats.isDirectory()) {
                console.error(`${config.databaseDirectory} is not a folder!`)
                process.exit(-1)
            }
        } else {
            fs.mkdirSync(config.databaseDirectory)
        }
        db = new loki(config.databaseDirectory + '/data', {
            adapter: new lfsa(),
            autoload: true,
            autoloadCallback: () => {
                msgs = db.getCollection('messages')
                if (msgs == null) {
                    msgs = db.addCollection('messages', {
                        unique: ['id'],
                        indices: ['author']
                    })
                }
            },
            autosave: false,
        })
        setInterval(() => db.saveDatabase(), 30000)
    },

    messages: () => { return msgs }
}