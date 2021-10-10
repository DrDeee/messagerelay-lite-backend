const express = require('express')

const auth = require('./auth')

const messages = require('./frontend/messages')

module.exports = () => {
    const router = express.Router()

    router.post('/frontend/messages/create', auth.jwt, messages.create)
    router.get('/frontend/messages', auth.jwt, messages.getAll)
    router.get('/frontend/messages/:id', auth.jwt, messages.get)
    router.delete('/frontend/messages/:id', auth.jwt, messages.delete)

    return router
}