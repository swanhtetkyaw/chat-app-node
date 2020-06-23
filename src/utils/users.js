const users = []

//add users
const addUser = ({id, username, room}) => {
    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    //check username and room is not undefined
    if (!username || !room) {
        return {
            error: "Username and room are required!"
        }
    }
    //check for existing users
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //Validate username
    if (existingUser) {
        return {
            error: "User is already existed"
        }
    }

    const user = { id, username, room }
    users.push(user)
    return { user }
}

//remove User
const removeUser = (id) => {
    //faster if u want find unique one
    const index = users.findIndex((user) => user.id === id)


    // if (index === -1) {
    //     return {
    //         error: "User not found"
    //     }
    // }

    return users.splice(index, 1)[0]
}

//getUser by ID
const getUser = (id) => {
    return users.find((user) => user.id === id)
}

//getUserlist in a room
const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}