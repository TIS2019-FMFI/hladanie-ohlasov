class Citations {
    constructor(data) {
        this.citationResults = {};
        this.citationsDiv = document.getElementById('citations');
        
        this.render(data);
        this.addEvents();
    }

    render(data) {
        let pubFieldSet = document.createElement('fieldset');
        let legend = document.createElement('legend');
        legend.innerText = data.pubTitle;
        pubFieldSet.appendChild(legend);
        pubFieldSet.appendChild(document.createTextNode(
            "doi: "+ data.publication.doi
        ));
        for (let cit of data.citations){
            let citFieldSet = document.createElement('fieldset');
            let legend = document.createElement('legend');
            legend.innerText = cit.publicationName;
            citFieldSet.appendChild(legend);
            let copyButton = document.createElement('button'); copyButton.innerHTML = "Kopírovať";
            citFieldSet.appendChild(copyButton);
            citFieldSet.appendChild(document.createElement('br'));
    
            citFieldSet.appendChild(document.createTextNode(
                "source: "+ cit.source + " | " +
                " year: "+ cit.year + " | " +
                " type: " + cit.type
            ));
    
            citFieldSet.appendChild(document.createElement('br'));
            citFieldSet.appendChild(document.createTextNode(cit.authors.length.toString() + " authors: "));
    
            for (let j=0; j<cit.authors.length; j++) {
                let author = cit.authors[j];
                citFieldSet.appendChild(document.createTextNode(author.name));
                if (j<cit.authors.length-1){
                    citFieldSet.appendChild(document.createTextNode(" – "));
                }
            }
    
            pubFieldSet.appendChild(citFieldSet);
        }
        this.citationsDiv.appendChild(pubFieldSet);

        document.body.style.cursor = "";
    
    }

    addEvents() {

    }
}

