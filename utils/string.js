const crypto = require('crypto')

module.exports = {
    random(size = 24) {
        return crypto
            .randomBytes(size)
            .toString('hex')
            .slice(0, size)
    }
}