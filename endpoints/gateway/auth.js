const authToken = require('../../config').authToken
module.exports = (wsManager) => {
    return (req, res) => {
        if (req.query.code == undefined) {
            res.status(400).json({
                msg: 'Missing websocket code'
            })
            return
        }
        if (req.query.token == undefined) {
            res.status(400).json({
                msg: 'Missing auth token'
            })
            return
        }
        if (req.query.token === authToken) {
            const success = wsManager.unlock(req.query.code)
            if (success) {
                res.status(204).end()
            } else {
                res.status(404).json({
                    msg: 'Invalid websocket code'
                })
            }
        } else {
            res.status(401).json({
                msg: 'Invalid auth token'
            })
        }
    }
}