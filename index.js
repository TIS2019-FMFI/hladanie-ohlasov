const express = require('express'),
    socket = require('socket.io'),
    fetch = require('node-fetch'),
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
        var scopus = new Scopus(data.name, data.surname, data.years, data.afiliation, data.DOI);
        fetch(scopus.getUrl())
        .then(response => response.json())
        .then(data => {
          socket.emit('publications', data);
        })
        .catch(err => console.log("ERROR"))

    });
});

class Scopus {
    constructor(name, surname, years, afiliation, DOI){
        this.name = name;
        this.surname = surname;
        this.years = years;
        this.afiliation = afiliation;
        this.DOI = DOI;
    }

    getUrl() {
        let res = "https://api.elsevier.com/content/search/scopus?query=";
        if (this.DOI){
            res += "DOI("+this.DOI+")";
        }
        else {
            res += "AUTHOR-NAME("+this.surname+", "+this.name+")";
            if (this.years) {
                res += ", PUBYEAR = "+ this.years;
            }
            if (this.afiliation) {
                res += ", AFFILORG("+ this.afiliation + ")";
            }
        }
        res += "&view=COMPLETE&apiKey="+apiKey+"&httpAccept=application/json";
        console.log(res);
        return url.parse(res);
    }
}