// Make Connection
const socket = io.connect("http://localhost:4000");

// Query DOM
    btn = document.getElementById('send');

// Emit events
var formular = document.getElementById('uvodnyFormular');

// Listen for events
socket.on('chat', (data) => {
    //output.innerHTML += '<p><strong>' + data.handle + ':</strong> ' + data.message + '</p>';
});