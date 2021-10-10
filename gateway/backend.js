const { WebSocketServer } = require('ws')

const config = require('../config')

const wss = new WebSocketServer({ noServer: true })

class GatewayHandler {
    constructor(server) {
        this.server = server
        server.on('connection', this.onConnect)
    }

    static unlock(client) {
        client.verified = true
        client.send(JSON.stringify({
            type: 'verified'
        }))
    }

    onConnect(ws, request, client) {
        ws.verified = false

        ws.on('message', (data, isBinary) => { GatewayHandler.onMessage(ws, data, isBinary) })
        console.log(`New websocket connection.`)
    }

    static onMessage(websocket, data, isBinary) {
        try {
            const content = JSON.parse(data.toString())
            if (websocket.verified) {

            } else {
                if (content.type && content.type === 'code' && content.code && content.code === config.authToken) {
                    GatewayHandler.unlock(websocket)
                } else {
                    websocket.send(JSON.stringify({
                        type: 'error',
                        msg: 'Invalid verify request'
                    }))
                    websocket.close()
                }
            }
        } catch (error) {
            console.error('Error while handling websocket message', error)
            websocket.send(JSON.stringify({
                type: 'error',
                msg: 'Message with invalid JSON'
            }))
            websocket.close()
        }
    }

    dispatch(data) {
        for (const client of this.server.clients) {
            if (client.verified) {
                client.send(JSON.stringify(data))
            }
        }
    }
}


const gatewayHandler = new GatewayHandler(wss)



module.exports = { server: wss, handler: gatewayHandler }