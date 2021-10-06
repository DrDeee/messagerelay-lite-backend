const express = require('express')

const auth = require('./auth')
module.exports = (wsManager) => {
    const router = express.Router()

    router.get('/auth/gateway/backend', require('./gateway/auth')(wsManager))

    router.use(auth.jwt)

    return router
}