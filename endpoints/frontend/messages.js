const uuid = require('uuid')

const db = require('../../database').messages
const gateway = require('../../gateway/backend').handler
module.exports = {
    create: (req, res) => {
        if (req.body.content && req.body.target && (req.body.target === 'wid' || req.body.target === 'iaow')) {
            const msg = db().insert({
                id: uuid.v4(),
                content: req.body.content,
                target: req.body.target,
                uid: req.user.sub,
                author: req.user.preferred_username,
                createdAt: new Date().getTime()
            })
            res.status(200).json({
                id: msg.id,
                uid: msg.uid,
                content: msg.content,
                target: msg.target,
                author: msg.author,
                createdAt: msg.createdAt
            })

            gateway.dispatch({
                type: 'create',
                id: msg.id,
                content: msg.content,
                target: msg.target
            })
            console.log('New message sent.')
        } else {
            res.status(400).json({
                msg: 'Missing or invalid fields'
            })
        }
    },
    getAll: (req, res) => {
        const entries = db().chain().find({})
            .simplesort('createdAt', {
                desc: true
            })
            .offset(req.query.page ? (Number.parseInt(req.query.page) - 1) * 25 : 0)
            .limit(25)
            .data()
        const msgs = []
        for (const msg of entries) {
            msgs.push({
                id: msg.id,
                uid: msg.uid,
                content: msg.content,
                target: msg.target,
                author: msg.author,
                createdAt: msg.createdAt
            })
        }
        res.status(200).json(msgs)
    },
    get: (req, res) => {
        if (!req.params.id) {
            res.status(400).json({
                msg: 'Missing parameter: id'
            })
            return
        }
        let id = req.params.id
        const msg = db().by('id', id)
        if (msg == null)
            res.status(404).json({
                msg: 'Message not found'
            })
        else res.status(200).json({
            id: msg.id,
            uid: msg.uid,
            content: msg.content,
            target: msg.target,
            author: msg.author,
            createdAt: msg.createdAt
        })

    },
    delete: (req, res) => {
        if (!req.params.id) {
            res.status(400).json({
                msg: 'Missing parameter: id'
            })
            return
        }

        let id = req.params.id
        const msg = db().by('id', id)
        if (msg != null) {
            db().remove(msg)
            gateway.dispatch({
                type: 'delete',
                id: id
            })
            res.status(204).end()
            console.log('Message deleted.')
        } else {
            res.status(404).json({
                msg: 'Message not found'
            })
        }

    }
}