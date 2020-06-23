const express = require('express')
const http = require('http')
const path = require('path')
const socket = require('socket.io')
const Filter = require('bad-words')
const {generateMessages, generateLocation} = require('./utils/messages')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')



const app = express()
const server = http.createServer(app)
const io = socket(server)


const port = process.env.port || 3000;
const dirPath = path.join(__dirname, '../public')
app.use(express.static(dirPath))


io.on('connection', (socket) => {
    console.log("A New member is connected")



    socket.on('join', (options, callback) => {
        //add user when join
        //adduser return user object or error object
        //socket.id is populated when connect event is triggered
        const {error, user} = addUser({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        //welcome message to sender client who just joined
        socket.emit('message', generateMessages("Admin", "Welcome!"))

        //notify all other user in same room 
        socket.broadcast.to(user.room).emit('message', generateMessages("Admin", `${user.username} has join ${user.room}`))

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        callback()
    })
    //check the  message is profane and send
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)

        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback("What a asshole u piece of shit dont rude!!")
        }
        io.to(user.room).emit('message', generateMessages(user.username, message));
        callback()
    })

    //send location to all user
    socket.on('sendLocation', (position, callback) => {
        const user = getUser(socket.id)

        io.to(user.room).emit('sendLocation', generateLocation(user.username, `https://www.google.com/maps?q=${position.latitude},${position.longtitude}`))
        callback()
    })

    //send all about a user left
    socket.on('disconnect', () => {
        //remove user when disconnected and return removed user object
        const user = removeUser(socket.id)

        if (user) {
            //show only people in same room
            io.to(user.room).emit('message', generateMessages(user.username, `${user.username} has left!`))

            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })

})


server.listen(port, () => {
    console.log(`Chatapp is running on port ${port}`)
})