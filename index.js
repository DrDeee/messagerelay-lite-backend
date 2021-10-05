const { parse } = require('url')
const { WebSocketServer } = require('ws')
const express = require('express')

const config = require('./config')
const WebSocketManager = require('./websocket')
const initEndpoints = require('./endpoints')

const wss = new WebSocketServer({ noServer: true })
const wsManager = new WebSocketManager(wss)

const app = express()

app.use(express.json())

app.use('/api/v1/', initEndpoints(wsManager))

const server = app.listen(config.port, () => console.info(`Server is listening on port ${config.port}.`))

server.on('upgrade', function upgrade(request, socket, head) {
    const { pathname } = parse(request.url);
    if (pathname === '/api/v1/gateway/backend') {
        wss.handleUpgrade(request, socket, head, function done(ws) {
            wss.emit('connection', ws, request)
        })
    } else {
        socket.destroy()
    }
})