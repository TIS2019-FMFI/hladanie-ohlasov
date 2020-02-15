class SearchForm {
    constructor(auth) {
        if (auth) {
            this.uvodForm = document.getElementById("uvodnyFormular");
            this.render();
            this.addEvents();
            this.uvodForm.hidden = false;
        }
    }

    render() {
        let doiCheckbox = document.createElement('input');
        doiCheckbox.id = 'doiSearch';
        doiCheckbox.type = 'checkbox';
        let doi = document.createElement('input');
        doi.id = 'DOI';
        doi.type = 'text';
        let name = document.createElement('input');
        name.id = 'name';
        name.type = 'text';
        let surname = document.createElement('input');
        surname.id = 'surname';
        surname.type = 'text';
        let years = document.createElement('input');
        years.id = 'years';
        years.type = 'text';
        let affiliation = document.createElement('input');
        affiliation.id = 'afiliation';
        affiliation.type = 'text';
        let sendButton = document.createElement('button');
        sendButton.id = "send";
        sendButton.innerHTML = 'Hľadaj';
        let fieldset1 = document.createElement('fieldset');
        let legend1 = document.createElement('legend');
        legend1.innerHTML = "Povinné Údaje:";
        fieldset1.appendChild(legend1);

        let label1 = document.createElement('label');
        label1.appendChild(document.createTextNode("Hľadať podľa DOI: "));
        label1.appendChild(doiCheckbox);
        label1.appendChild(document.createElement('br'));

        let label2 = document.createElement('label');
        label2.className = 'B';
        label2.hidden = true;
        label2.appendChild(document.createTextNode("DOI: "));
        label2.appendChild(doi);
        label2.appendChild(document.createElement('br'));

        let label3 = document.createElement('label');
        label3.className = 'A';
        label3.appendChild(document.createTextNode("Meno: "));
        label3.appendChild(name);

        let label4 = document.createElement('label');
        label4.className = 'A';
        label4.appendChild(document.createTextNode(" Priezvisko: "));
        label4.appendChild(surname);
        label4.appendChild(document.createElement('br'));

        fieldset1.appendChild(label1);
        fieldset1.appendChild(label2);
        fieldset1.appendChild(label3);
        fieldset1.appendChild(label4);

        let fieldset2 = document.createElement('fieldset');
        fieldset2.className = 'A';
        let legend2 = document.createElement('legend');
        legend2.innerHTML = "Voliteľné Údaje:";
        fieldset2.appendChild(legend2);

        let label5 = document.createElement("label");
        label5.innerHTML = "Roky a množiny rokov: ";
        label5.className = 'A'; 
        label5.appendChild(years);

        fieldset2.appendChild(label5);
        let help1 = document.createElement('a');
        help1.id = 'help1';
        help1.innerHTML = '<strong>?</strong><br>';
        label5.appendChild(help1);
        let help1Content = document.createElement('div');
        help1Content.id = 'yearsHelp';
        help1Content.hidden = true;
        help1Content.innerHTML = "<a id=\"closeHelp1\"><strong>(zbaliť pomôcku)</strong></a>\n" +
            "                <p>Zadajte konkrétne roky a časové obdobia, v ktorých sa majú záznamy vyhľadávať.<br>\n" +
            "                   VZORY: <br>\n" +
            "                    'XXXX' znamená v roku XXXX.<br>\n" +
            "                    'XXXX-YYYY' znamená od roky XXXX do roku YYYY (vrátane).<br>\n" +
            "                    'XXXX-' znamená od roku XXXX po súčasnosť.<br><br>\n" +
            "                    Jednotlivé vzory oddeľujte znakmi &&.<br><br>\n" +
            "                    PRÍKLAD: <br> '-1200 && 1520-1525 && 1998 && 2000 && 2010-'<br>\n" +
            "                    Vyhľadá záznamy od nepamäti do roku 1200 a od roku 1520 do roku 1525 a v roku 1998 a v roku 2000 a od roku 2010 až po súčasnosť.\n" +
            "                </p>";
        label5.appendChild(help1Content);

        let label6 = document.createElement("label");
        label6.innerHTML = "Affiliácia: ";
        label6.className = 'A'; 
        label6.appendChild(affiliation);

        fieldset2.appendChild(label6);
        let help2 = document.createElement('a');
        help2.id = 'help2';
        help2.innerHTML = '<strong>?</strong><br>';
        label6.appendChild(help2);
        let help2Content = document.createElement('div');
        help2Content.id = 'afilHelp';
        help2Content.hidden = true;
        help2Content.innerHTML = '<a id="closeHelp2"><strong>(zbaliť pomôcku)</strong></a>\n' +
            '                <p>Zadajte konkrétne afiliácie.<br>\n' +
            '                    Jednotlivé afiliácie oddeľujte znakmi &&.<br><br>\n' +
            '                    PRÍKLAD: <br> \'Mars University && Hogwarts\'<br>\n' +
            '                    Vyhľadá iba záznamy s afiliáciami Mars University a Hoqwarts.\n' +
            '                </p>';
        label6.appendChild(help2Content);

        this.uvodForm.appendChild(fieldset1);
        this.uvodForm.appendChild(fieldset2);
        this.uvodForm.appendChild(sendButton);
    }

    addEvents() {
        var searchByDOI = document.getElementById('doiSearch');
        searchByDOI.addEventListener('click', () => {
            var elemsA = document.getElementsByClassName('A');
            var elemsB = document.getElementsByClassName('B');

            for (let i = 0, len = elemsA.length | 0; i < len; i = i + 1 | 0) {
                elemsA[i].hidden = searchByDOI.checked;
            };

            for (let i = 0, len = elemsB.length | 0; i < len; i = i + 1 | 0) {
                elemsB[i].hidden = !searchByDOI.checked;
            };
        });

        var searchBtn = document.getElementById('send');
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();

            if (this.validate()) {
            this.uvodForm.hidden = true;

            let doiSearch = document.getElementById('doiSearch').checked;
            
            socket.emit('uvodnyFormular', {
                searchByDOI: doiSearch,//document.getElementById('doiSearch').checked,
                DOI: (doiSearch) ? document.getElementById('DOI').value : '',
                name: (doiSearch) ? '' : document.getElementById('name').value,
                surname: (doiSearch) ? '' : document.getElementById('surname').value,
                years: (doiSearch) ? '' : document.getElementById('years').value,
                afiliation: (doiSearch) ? '' : document.getElementById('afiliation').value
            });
            document.body.style.cursor = "progress";
            
        }});

        var helpp1 = document.getElementById('help1');
            help1.addEventListener('click', () => {
                let doiHelp = document.getElementById('yearsHelp');
                doiHelp.hidden = false;
                helpp1.hidden = true;
            });

            var closeHelp1 = document.getElementById('closeHelp1');
            closeHelp1.addEventListener('click', () => {
                let doiHelp = document.getElementById('yearsHelp');
                doiHelp.hidden = true;
                helpp1.hidden = false;
            });

            var helpp2 = document.getElementById('help2');
            help2.addEventListener('click', () => {
                let afilHelp = document.getElementById('afilHelp');
                afilHelp.hidden = false;
                helpp2.hidden = true;
            });

            var closeHelp2 = document.getElementById('closeHelp2');
            closeHelp2.addEventListener('click', () => {
                let afilHelp = document.getElementById('afilHelp');
                afilHelp.hidden = true;
                helpp2.hidden = false;
            });
    }

    validate() {
        let valid = true;
        let doiSearch = document.getElementById('doiSearch').checked;
        if (doiSearch){
            let doi = document.getElementById('DOI');
            if (doi.value != '') {
                doi.classList.remove("error");
            } else {
                doi.classList.add("error");
                valid = false;
            }
        } else {
            let name = document.getElementById('name');
            let surname = document.getElementById('surname');
            let years = document.getElementById('years');
            //let afiliation = document.getElementById('afiliation');
            if (name.value != ''){
                name.classList.remove("error");
            } else {
                name.classList.add("error");
                valid = false;
            }
            if (surname.value != ''){
                surname.classList.remove("error");
            } else {
                surname.classList.add("error");
                valid = false;
            }
            if (RegExp('^[- 0-9]*(&&[0-9 -]+)*$').test(years.value)){
                years.classList.remove("error");
            } else {
                years.classList.add("error");
                valid = false;
            }
            /*
            if (RegExp('^[a-zA-Z1-9]*(&&[a-zA-Z1-9]+)*$').test(afiliation.value)){
                afiliation.classList.remove("error");
            } else {
                afiliation.classList.add("error");
                valid = false;
            }
            */
        }
        return valid;
    }
    
}
