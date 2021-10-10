const { parse } = require('url')
const express = require('express')
const cors = require('cors')

require('./database').init()

const config = require('./config')
const initEndpoints = require('./endpoints')

const backendGatewayServer = require('./gateway/backend').server

const app = express()

app.use(express.json())
app.use(cors())

app.use('/api/v1/', initEndpoints())

const server = app.listen(config.port, () => console.info(`Server is listening on port ${config.port}.`))

server.on('upgrade', function upgrade(request, socket, head) {
    const { pathname } = parse(request.url);
    if (pathname === '/api/v1/gateway/backend') {
        backendGatewayServer.handleUpgrade(request, socket, head, function done(ws) {
            backendGatewayServer.emit('connection', ws, request)
        })
    } else {
        socket.destroy()
    }
})