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

const errorCheck = (err, req, res, next) => {
    console.error('Error while logging in:', err)
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({
            msg: 'Invalid auth token'
        });
    }
}

let auth
if (process.env.NOAUTH != undefined)
    auth = [(req, res, next) => {
        req['user'] = {
            sub: '123-123-123-123',
            preferred_username: 'Testuser'
        }
        next()
    }]
else
    auth = [jwtCheck, errorCheck]

module.exports = {
    jwt: auth,
    /*    requireCTF: [(req, res, next) => {
           if (req.user.groups != undefined && req.user.groups.includes('ctf')) {
               next()
               return
           } else {
               res.status(403).json({
                   msg: 'Not a CTF member'
               })
           }

       }] */
}