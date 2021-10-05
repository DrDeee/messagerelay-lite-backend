const express = require('express')
module.exports = (wsManager) => {
    const router = express.Router()

    router.get('/auth/gateway/backend', require('./gateway/auth')(wsManager))

    return router
}