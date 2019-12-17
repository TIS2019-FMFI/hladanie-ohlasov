// Make Connection
const socket = io.connect("http://localhost:4000");

// Query DOM
    btn = document.getElementById('send');

// Emit events
var formular = document.getElementById('uvodnyFormular');

// Listen for events
socket.on('publications', (data) => {
    console.log(data);
});