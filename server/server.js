const express = require('express')
const bodyParser = require('body-parser')
const server = express()
const insert = require('../db/scripts/insert.js')
const remove = require('../db/scripts/remove.js')
const update = require('../db/scripts/update.js')
const select = require('../db/scripts/select.js')

server.use(bodyParser.json())
server.post('/create-user', async (req, res) => {
    const { email, data, publicKey, privateKey } = req.body
    insert('users', { email, data, publicKey, privateKey })
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

