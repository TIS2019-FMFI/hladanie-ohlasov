const translators = require('./private/Scopus.js'); // nacitavanie vlastnych modulov

const express = require('express'),
    socket = require('socket.io'),
//AT HOME:
//before every session in linux terminal set enviroment variable:
//linux bash:  export ALL_PROXY="http://login:password@proxy.uniba.sk:3128"
//windows: go to proxy setttings,add script address ->  http://www.uniba.sk/proxy.pac
    fetch = require('node-fetch-with-proxy')
//AT SCHOOL:
//fetch = require('node-fetch'),

url = require('url'),
// app setup
    app = express(),
    apiKey = "7f59af901d2d86f78a1fd60c1bf9426a";
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
        var scopus = new translators.Scopus(data.name, data.surname, data.years, data.afiliation, data.DOI);
        fetch(scopus.getUrl())
            .then(response => response.json())
            .then(data => {
                socket.emit('publications', data);
            })
            .catch(err => console.log("ERROR"))

    });
});
