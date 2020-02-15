class Publications {
    constructor(data) {
        this.searchResults = {};
        this.resultForm = document.getElementById("resultFormular");
        this.id = 0;

        if (data.numberOfResults != 0) {
            this.render(data);
            this.renderCit();
            this.addEvents();
        }
        else {
            this.noResults(data.source);
        }
        this.renderBack();
        this.resultForm.hidden = false;
    }

    render(data) {
        let pubs = data.publications;
        let resultsDiv = document.getElementsByClassName('searchResults')[0];
        let buttonDiv = document.getElementsByClassName('buttonDiv')[0];

        if(document.getElementById('moreButton')) {
            document.getElementById('moreButton').disabled = false;
        }
        
        for (var i = 0; i < pubs.length; i++) {
            
            let fieldSet = document.createElement('fieldset');
            let checkBox = document.createElement('input'); checkBox.type = 'checkbox';
            this.searchResults[this.id++] = {...pubs[i], check: checkBox, self: fieldSet};
            fieldSet.appendChild(checkBox);

            let legend = document.createElement('legend'); legend.innerText = pubs[i].title;
            fieldSet.appendChild(legend);
            fieldSet.appendChild(document.createTextNode(
                "source: "+pubs[i].source + " | " +
                " year: "+ pubs[i].year.split('-')[0] + " | " +
                " volume: " + pubs[i].volume + " | " +
                " pages: " + pubs[i].pages + " | " +
                " doi: " + pubs[i].doi
            ));
            fieldSet.appendChild(document.createElement('br'));
            fieldSet.appendChild(document.createTextNode(pubs[i].authors.length.toString() + " authors: "));

            for (let j=0; j<pubs[i].authors.length; j++) {
                let author = pubs[i].authors[j];
               fieldSet.appendChild(document.createTextNode(author.surname + ", " + author.name));
               if (j<pubs[i].authors.length-1){
                   fieldSet.appendChild(document.createTextNode(" – "))
               }
            }

            resultsDiv.appendChild(fieldSet);

        }

        if ('next' in data) {
            if (document.getElementById('moreButton') === null) {
                let moreButton = document.createElement('button');
                moreButton.id = "moreButton";
                moreButton.innerHTML = 'Vyhladaj dalsie vysledky';
                buttonDiv.appendChild(moreButton);
                moreButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    moreButton.disabled = true;
                    socket.emit('searchMore', data.next);
                });
            }
            
        } else {
            if (document.getElementById('buttonDiv')) {
                moreButton.hidden = true;
            }
        }
        document.body.style.cursor = "";
        console.log(this.searchResults)
    }

    renderCit() {
        let citButton = document.createElement('button');
        citButton.id = "citButton";
        citButton.innerHTML = 'Vyhladaj citacie';
        document.getElementsByClassName('buttonDiv')[0].appendChild(citButton);
    }

    addEvents() {
        document.getElementById("citButton").addEventListener('click', (e) => {
            e.preventDefault();
            let res = [];
            for (let key in this.searchResults) {
                if (this.searchResults[key].check.checked === true){
                    res.push(this.searchResults[key]);
                }
            }
            socket.emit('searchCitations', res);
            let citWindow = window.open('http://localhost:4000/citations.html');
            socket.on('searchedCitations', (data) => {
                citWindow.Citations(data);
            });
            
        });
    }

    noResults(source) {
        let message = document.createElement("p");
        message.innerHTML = "Žiadne výsledky pre <b>" + source + "</b>";
        document.getElementsByClassName('messages')[0].appendChild(message);
    }

    renderBack() {
        let backButton = document.createElement('button');
        backButton.id = "backButton";
        backButton.innerHTML = 'Späť';
        document.getElementsByClassName('buttonDiv')[0].appendChild(backButton);

        document.getElementById("backButton").addEventListener('onclick', function() {
            e.preventDefault();
            console.log("hrere");
            document.getElementsByClassName("searchResults").innerHTML = "";
            document.getElementById("backButton").hidden = false;
        });
    }
}