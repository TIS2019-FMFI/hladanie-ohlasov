class Citations {
    constructor(data) {
        this.citationResults = [];
        this.citationsDiv = document.getElementById('citations');
        this.id = 0;

        this.render(data);
    }

    render(data) {
        console.log(data);
        let pubFieldSet = document.createElement('fieldset');
        let legend = document.createElement('legend');
        legend.innerText = data.publication.title;
        pubFieldSet.appendChild(legend);
        pubFieldSet.appendChild(document.createTextNode(
            "doi: "+ data.publication.doi
        ));
        for (let cit of data.citations){
            
            let citFieldSet = document.createElement('fieldset');
            let legend = document.createElement('legend');
            legend.innerText = cit.article;
            citFieldSet.appendChild(legend);
            let copyButton = document.createElement('button'); 
            copyButton.innerHTML = "Kopírovať";
            copyButton.className = "copy";
            let field591 = document.createElement('p'); 
            field591.hidden = true;
            field591.innerHTML = this.format(cit);
            this.copyEvent(this, copyButton);

            citFieldSet.appendChild(field591);
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
                citFieldSet.appendChild(document.createTextNode(author.surname + ", " + author.name));
                if (j<cit.authors.length-1){
                    citFieldSet.appendChild(document.createTextNode(" – "));
                }
            }
    
            pubFieldSet.appendChild(citFieldSet);
        }
        this.citationsDiv.appendChild(pubFieldSet);

        document.body.style.cursor = "";
    
    }

    copyStringToClipboard (string) {
        function handler (event){
            event.clipboardData.setData('text/plain', string);
            event.preventDefault();
            document.removeEventListener('copy', handler, true);
        }
    
        document.addEventListener('copy', handler, true);
        document.execCommand('copy');
    }

    copyEvent(self, element){
        element.addEventListener("click", function() {
            let field591 = element.parentElement.getElementsByTagName("p")[0];
            self.copyStringToClipboard(field591.innerHTML);
        });
    }

    format(data){
        let authors = "", res = "";
        for (let j=0; j<data.authors.length; j++) {
            let author = data.authors[j];
            authors += author.surname + ", " + author.name;
            if (j<data.authors.length-1){
                authors += " – ";
            }
        }
        if (data.type == "Article") {
            res = "\\9 [" + data.oN + "] \\d " + data.year + " \\m " + authors + " \\n " + data.article +
            " \\p " + data.pub + ", " + data.pubVolume + ", " + data.pubYear + " \\s " + data.id1 +
            " " + data.id2 + " \\t SSCI ; SCOPUS";
        } else if (data.type == "Monograf") {
            res = "\\9 [" + data.oN + "] \\d " + data.year + " \\m " + authors + " \\n " + data.article +
            " \\p " + data.pub + " \\r " + data.place + " : " + data.publisher + ", " + data.pubYear + " \\s " + data.id1 +
            " " + data.id2;
        }
        return res;
        
    }
}

