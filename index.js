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

const fakeData = {
    citations: [
        {
            source: "Scopus",
            article: "Collectivity from interference",
            year: "2017",
            type: "Article",
            oN: "o1",
            authors: [
                {
                    surname: "Blok",
                    name: "B."
                },
                {
                    surname: "Strikman",
                    name: "M."
                },
                {
                    surname: "Wiedemann",
                    name: "U. A."
                },
                {
                    surname: "Jakel",
                    name: "C. D."
                }
                
            ],
            pub: "Journal of High Energy Physics",
            pubVolume: "No. 12",
            pubYear: "2017",
            id1: "Art.",
            id2: "No. 074",
            place: "",
            publisher: ""
        },
        {
            source: "Scopus",
            article: "Proton-proton collisions prove stranger than expected",
            year: "2017",
            type: "Article",
            oN: "o1",
            authors: [
                {
                    surname: "Chang",
                    name: "S."
                }
            ],
            pub: "Physics Today",
            pubVolume: "Vol. 70",
            pubYear: "2017",
            id1: "s.",
            id2: "21-23",
            place: "Bratislava",
            publisher: "Publish Co."
        },
        {
            source: "Scopus",
            article: "Review of bottomonium measurements from CMS",
            year: "2019",
            type: "Monograf",
            oN: "o2",
            authors: [
                {
                    surname: "Hu",
                    name: "Z."
                },
                {
                    surname: "Liu",
                    name: "T."
                },
                {
                    surname: "Leonardo",
                    name: "N. T."
                },
                {
                    surname: "Haytmyradov",
                    name: "M."
                }
            ],
            pub: "International Journal of Modern Physics A",
            pubVolume: "Vol. 32",
            pubYear: "2019",
            id1: "Art.",
            id2: "No. 1730024",
            place: "Thaiwan",
            publisher: "Publish Co."
        }
    ]
}


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

    // kontrola kluca
    socket.on('autorizacia', (data) => {
        let key = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'private/config.json'))).key;
        if (data.authKey === key){
            socket.emit('approved');
        } else {
            socket.emit('denied');
        }
    });

    // vyhladavanie publikacii po vyplneni uvodneho formulara
    socket.on('uvodnyFormular', (data) => {
        translators.forEach(translator => {
            let years = data.years.split("&&");
            let urls = [];
            for (let year of years) {
                urls.push(translator.getUrl(data.name, data.surname, year, data.afiliation, data.DOI));
            }
            for (let url of urls){
                let response = translator.getSearchResults(url);
                response.then(response => socket.emit('searchedPublications', response));
            }   
        });
    });

    // dodatocne dohladavanie publikacii
    socket.on('searchMore', (url) => {
        translators.forEach(translator => {
            let response = translator.getSearchResults(url);
            response.then(response => socket.emit('searchedPublications', response));
        });
    });

    // vyhladavanie citacii
    socket.on('searchCitations', (data) => { 
        data.forEach(obj => {
            translators.forEach(translator => {
                /*
                let response = translator.getCitationResults(translator.getCitationUrl(obj.scopusId));
                response.then(response => socket.emit('searchedCitations', {...response, pubTitle: obj.title}));
                */
                setTimeout(function () {
                    socket.emit('searchedCitations', {...fakeData, publication: obj});
                }, 500)
            });
        });

    });

});


