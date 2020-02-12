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

    socket.on('autorizacia', (data) => {
        let key = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'private/config.json'))).key;
        if (data.authKey === key){
            socket.emit('approved');
        } else {
            socket.emit('denied');
        }
    });

    socket.on('uvodnyFormular', (data) => {
        translators.forEach(translator => {
            let response = translator.getSearchResults(translator.getUrl(data.name, data.surname, data.years, data.afiliation, data.DOI));
            response.then(response => socket.emit('searchedPublications', response));
        });
    });

    socket.on('searchMore', (url) => {
        translators.forEach(translator => {
            let response = translator.getSearchResults(url);
            response.then(response => socket.emit('searchedPublications', response));
        });
    });

    socket.on('searchCitations', (data) => { 
        data.forEach(obj => {
            translators.forEach(translator => {
                let response = translator.getCitationResults(translator.getCitationUrl(obj.scopusId));
                response.then(response => socket.emit('searchedCitations', {...response, pubTitle: obj.title}));
            });
        });

    });

});


