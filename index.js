const express = require('express'),
      socket = require('socket.io'),

// app setup
    app = express(),
    server = app.listen(4000, () => {
        console.log('listening to requests on port 4000');
    });

// static files
    app.use(express.static('public'));

// socket setup
    const io = socket(server);

    io.on('connection', (socket) => {
        console.log('made socket connection ', socket.id);

        socket.on('uvodnyFormular', (data) => {
            console.log(data);
        });
    });