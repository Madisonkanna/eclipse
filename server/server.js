const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const server = express()
const insert = require('../db/scripts/insert.js')
const remove = require('../db/scripts/remove.js')
const update = require('../db/scripts/update.js')
const select = require('../db/scripts/select.js')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const keyMaterial = crypto.randomBytes(128)
// Create hash object, feed in data. Convert key into string.
const secretKey = crypto.createHash('sha256').update(keyMaterial).digest('hex')

server.use(cors())
server.use(bodyParser.json())
const whiteListedPaths = ['/pre-login', '/login', '/create-user']
server.use((req, res, next) => {
    if (whiteListedPaths.includes(req.path)) {
        next()
        return
    }
    const token = req.headers.authorization
    if (!token) {
        res.send(404)
        return
    }
    console.log(token, 'token')
    const valid = jwt.verify(token, secretKey)
    if (!valid) {
        res.send(404)
        return
    }
    next()
})

server.post('/pre-login', async (req, res) => {
    const { email } = req.body 
    const [success, response] = await select('users', { email })
    res.send({
        success: !!response[0],
        salt: response[0] ? response[0].salt : undefined
    })
})

server.post('/login', async (req, res) => {
    const { email, hash } = req.body
    const [success, response] = await select('users', { email })
    if (!response[0]) {
        res.send({
            success: false
        })
        return
    }
    const hashesMatch = response[0].hash === hash
    const tokenPayload = { id: response[0].id }
    const token = jwt.sign(tokenPayload, secretKey)
    const responsePayload = { token, success: hashesMatch }
    if (hashesMatch) {
        responsePayload.user = response[0]
    }
    res.send(responsePayload)
})

server.post('/create-user', async (req, res) => {
    const { email, data, publicKey, privateKey, salt, hash, dataKey } = req.body
    const [success, response] = await insert('users', { email, data, public_key: publicKey, private_key: privateKey, salt, hash, data_key: dataKey })
    res.send({...response, success})
})

server.post('/start-chat', async (req, res) => {
    const { name, users, chatKey } = req.body 
    const [success, response] = await insert('chats', { name })

    if (users.length) {
        users.map(user => insert('chat_users', {
            user_id: user.id, 
            chat_id: response.insertId,
            chat_key: chatKey
        }))
    }
    res.send({
        ...response, success
    })
})

server.post('/add-chat-user', async (req, res) => {
    const { id, userId, chatId, chatKey } = req.body
    const [success, response] = await insert('chat_users', {
        id, user_id, chat_id, chat_key
    })
    res.send({...response, success})
})

server.post('/get-user-data', async (req, res) => {
    const [success, response] = await select('users')
    console.log('response, success:', success, response)
    res.send({data: response, success})
})

server.listen(3000, () => {
    console.log('Hello World!')
})
/* Server reqs
Connect to db.
Endpoints:
Create user.
Login.
Start chat.
Update chat name.
Delete chat.
Leave chat.
Add chat user. 
Remove chat user. 
Send message.
Delete message. 
Edit message. 

*/ 

