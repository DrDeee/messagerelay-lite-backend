const { random } = require('./utils/string')
class WebSocketManager {
    constructor(server) {
        this.server = server
        server.on('connection', this.onConnect)
    }

    unlock(code) {
        for (const client of this.server.clients) {
            if (client.code === code) {
                client.verified = true
                client.send(JSON.stringify({
                    type: 'verified'
                }))
                return true
            }
        }
        return false
    }

    onConnect(ws, request, client) {
        const code = random()
        for (const client of this.clients) {
            if (client.code === code) {
                this.onConnect(ws, request, client)
                return
            }
        }
        ws.verified = false
        ws.code = code
        ws.send(JSON.stringify({
            type: 'code',
            code
        }))
        console.log(request)
        ws.on('message', (data, isBinary) => this.onMessage(ws, data, isBinary))
        console.log(`New websocket connection.'`)
    }

    onMessage(websocket, data, isBinary) {
        try {
            const content = JSON.parse(data)
        } catch (error) {
            if (this.verified.includes(websocket))
                this.verified.remove
            websocket.send(JSON.stringify({
                type: 'error',
                msg: 'Message with invalid JSON'
            }))
            websocket.close()
        }
    }
}

module.exports = WebSocketManager