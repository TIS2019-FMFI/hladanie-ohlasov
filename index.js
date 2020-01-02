const
    fs = require('fs'),
    path = require('path'),
    //translators = require('./private/Scopus.js'), // nacitavanie vlastnych modulov
    express = require('express'),
    app = express(),
    socket = require('socket.io'),
    //AT HOME:
    //before every session in linux terminal set enviroment variable:
    //linux bash:  export ALL_PROXY="http://login:password@proxy.uniba.sk:3128"
    //windows: go to proxy setttings,add script address ->  http://www.uniba.sk/proxy.pac
    fetch = require('node-fetch-with-proxy'); // AT SCHOOL: fetch = require('node-fetch');

// static files
app.use(express.static('public'));

// server
server = app.listen(4000, () => {
    console.log('listening to requests on port 4000');
});
const io = socket(server);


// prepare "translators" array for each db in config.json:

const translators = [];
let databasesJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'private/config.json'))).databases;
for (let key in databasesJSON) {
    if (databasesJSON.hasOwnProperty(key)) {
        translators.push(
            new (require(path.resolve(__dirname, 'private/' + databasesJSON[key]['translatorFileName'])))
                .Translator(databasesJSON[key]['apiKey'])
        );
    }
}

// handling events:
io.on('connection', (socket) => {
    console.log('Made socket connection ', socket.id);

    socket.on('uvodnyFormular', (data) => {
        translators.forEach(translator => {
            fetch(translator.getUrl(data.name, data.surname, data.years, data.afiliation, data.DOI))
                .then(response => response.json())
                .then(response => socket.emit('publications', response))
                .then(response => translator.parseData(response))
                .then(response => {
                    console.log(response);
                })
        });
    });

});
