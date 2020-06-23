var socket = io()

//Elements
const $messageForm = document.getElementById("message-form")
const $messageInput = $messageForm.querySelector('input')
const $messageButton = $messageForm.querySelector('button')
const $locationButton = document.getElementById('get-location')
//place holder for template
const $message = document.querySelector('#message')
//sidebar placeholder for template
const $sidebar = document.querySelector('#sidebar')

//template for message and location
const $messageTemplate = document.querySelector('#message-template').innerHTML
const $locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const $sideBarTemplate = document.querySelector('#sidebar-template').innerHTML

//Query
const {username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true })

// received message object from server and put it to the web page
socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render($messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $message.insertAdjacentHTML('beforeend', html)
})

// recevied location object from server  and put is to the web page
socket.on('sendLocation', (Mylocation) => {
    console.log(location)
    const html = Mustache.render($locationMessageTemplate, {
        username: Mylocation.username,
        location: Mylocation.location,
        createdAt: moment(Mylocation.createdAt).format('h:mm a')
    })
    $message.insertAdjacentHTML('beforeend', html)

})

//sidebar 
socket.on('roomData', ({room, users}) => {
    console.log(users)
    const html = Mustache.render($sideBarTemplate, {
        room,
        users
    })
    $sidebar.innerHTML = html

})

//input form for send message
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    var message = e.target.elements.message.value

    //disable button
    $messageButton.setAttribute('disabled', 'disabled')
    socket.emit('sendMessage', message, (error) => {
        //enable button 
        $messageButton.removeAttribute('disabled')
        $messageInput.value = ''
        $messageInput.focus()

        if (error) {
            return console.log(error)
        }
        console.log("message is send")
    })

})

//button for send location
$locationButton.addEventListener('click', (e) => {
    e.preventDefault()
    if (!navigator.geolocation) {
        return alert("Geolocation is not supported for this browser")
    }
    //disable button
    $locationButton.setAttribute('disabled', 'disabled')
    //using geolocation API and send location to server
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longtitude: position.coords.longitude
        }, () => {
            $locationButton.removeAttribute('disabled')
            console.log('location shared!')
        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = "/"
    }
})

// socket.on('increment',(num)=>{
//     console.log("The count has being updated", num)
// })

// document.querySelector('#increment').addEventListener('click',()=>{
//     console.log("clicked")
//     socket.emit('countUpdate')
// })