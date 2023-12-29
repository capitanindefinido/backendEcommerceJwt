const socket = io()
let user
let chatbok = document.querySelector('#chatBox')

Swal.fire({
    title: 'Identificate',
    input:'text',
    text: 'Ingresa un nombre de usuario para identificarte.',
    inputValidator: value => {
        return !value && 'Necesitás ingresar un nombre de usuario si o sí.'
    },
    allowOutsideClick: false
}).then( resultado => {
    user = resultado.value
    socket.emit('authenticated', user)
})

const handleInput = (evt)=>{
    if(evt.key === 'Enter'){
        if (chatbok.value.trim().length > 0) {
            // socket al servidor
            socket.emit('message', /* `{user, messge: chatbok.value})` is creating an object with two
            properties: `user` and `messge`. */
            {user, message: chatbok.value})
            chatbok.value = ''
        }
    }
}

chatbok.addEventListener('keyup', handleInput)

socket.on('messageLogs', data => {
    let logP = document.querySelector('#messageLogs')
    let messagesText = ''
    data.forEach(message => {
        messagesText += `${message.user} dice: ${message.message}<br>`
    })
    logP.innerHTML = messagesText
})

socket.on('newUserConnected', userName => {
    if(!userName) return
    Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 10000,
        title: `${userName} se a unido al chat`,
        icon: 'success'
    })
})