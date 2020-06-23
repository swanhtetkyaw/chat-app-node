const generateMessages = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const generateLocation = (username, location) => {
    return {
        username,
        location,
        createdAt: new Date().getTime()
    }

}

module.exports = {
    generateMessages,
    generateLocation
}