const fs = require('fs')

const jwt = require('express-jwt')

const config = require('../config')

if (!fs.existsSync(config.publicKeyFile)) {
    console.error('No public key file: ' + config.publicKeyFile)
    process.exit(-1)
}

const publicKey = fs.readFileSync(config.publicKeyFile);
const jwtCheck = jwt({
    secret: publicKey,
    algorithms: ["RS256"]
})

module.exports = {
    jwt: [jwtCheck],
    requireCTF: [(req, res, next) => {
        if (req.user.groups != undefined && req.user.groups.includes('ctf')) {
            next()
            return
        } else {
            res.status(403).json({
                msg: 'Not a CTF member'
            })
        }

    }]
}