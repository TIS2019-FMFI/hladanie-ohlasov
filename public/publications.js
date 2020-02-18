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
        document.body.style.cursor = "";
        this.resultForm.hidden = false;
    }

    render(data) {
        console.log(data);
        let pubs = data.publications;
        let resultsDiv = document.getElementsByClassName('searchResults')[0];
        let buttonDiv = document.getElementsByClassName('buttonDiv')[0];

        if(document.getElementById('moreButton')) {
            document.getElementById('moreButton').disabled = false;
        }
        
        for (var i = 0; i < pubs.length; i++) {
            
            let fieldSet = document.createElement('fieldset');
            let checkBox = document.createElement('input'); checkBox.type = 'checkbox'; checkBox.style.float = "right";
            checkBox.addEventListener('click', function(e) {
                if (e.target.checked) {
                    fieldSet.classList.add("checked");
                } else {
                    fieldSet.classList.remove("checked");
                }
            });
            this.searchResults[this.id++] = {...pubs[i], check: checkBox, self: fieldSet};
            fieldSet.appendChild(checkBox);

            let legend = document.createElement('legend'); legend.innerText = pubs[i].title;
            fieldSet.appendChild(legend);
            let dataDiv = document.createElement('div'); dataDiv.style.width = "95%";
            fieldSet.appendChild(dataDiv);
            let yearDiv = document.createElement('div');
            yearDiv.className = "year";
            yearDiv.innerHTML = "<b>Year:</b> " + pubs[i].year.split('-')[0];
            dataDiv.appendChild(yearDiv);
            let sourceDiv = document.createElement('div');
            sourceDiv.className = "source";
            sourceDiv.innerHTML = "<b>Source:</b> " + pubs[i].source;
            dataDiv.appendChild(sourceDiv);
            if (pubs[i].volume != undefined) {
                let volumeDiv = document.createElement('div');
                volumeDiv.className = "volume";
                volumeDiv.innerHTML = "<b>Volume:</b> " + pubs[i].volume;
                dataDiv.appendChild(volumeDiv);
            }
            if (pubs[i].pages != null) {
                let pagesDiv = document.createElement('div');
                pagesDiv.className = "pages";
                pagesDiv.innerHTML = "<b>Pages:</b> " + pubs[i].pages;
                dataDiv.appendChild(pagesDiv);
            }
            if (pubs[i].issue != undefined) { 
                let issueDiv = document.createElement('div');
                issueDiv.className = "issue";
                issueDiv.innerHTML = "<b>Issue:</b> " + pubs[i].issue;
                dataDiv.appendChild(issueDiv);
            }
            let countDiv = document.createElement('div');
            countDiv.className = "count";
            countDiv.innerHTML = "<b>Citation count:</b> " + pubs[i].citationCount;
            dataDiv.appendChild(countDiv);
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
        
        console.log(this.searchResults);
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
            let Citations = null;
            socket.on('searchedCitations', (data) => {
                if (!Citations){
                    Citations = citWindow.Citations(data);
                } else {
                    Citations.render(data);
                }
                
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