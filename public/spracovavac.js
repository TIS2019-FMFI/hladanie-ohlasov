var searchByDOI = document.getElementById('doiSearch');
searchByDOI.addEventListener('click', () => {
    var elemsA = document.getElementsByClassName('A');
    var elemsB = document.getElementsByClassName('B');

    for (let i=0, len=elemsA.length|0; i<len; i=i+1|0) {
        elemsA[i].hidden = searchByDOI.checked;
    };

    for (let i=0, len=elemsB.length|0; i<len; i=i+1|0) {
        elemsB[i].hidden = !searchByDOI.checked;
    };
});

var searchBtn = document.getElementById('send');
    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let form = document.getElementById('uvodnyFormular');
            form.hidden = true;

        socket.emit('uvodnyFormular', {
            searchByDOI:document.getElementById('doiSearch').value,
            DOI:document.getElementById('DOI').value,
            name:document.getElementById('name').value,
            surname:document.getElementById('surname').value,
            years:document.getElementById('years').value,
            afiliation:document.getElementById('afiliation').value
        });
    });

    var help1 = document.getElementById('help1');
    help1.addEventListener('click', () => {
        let doiHelp = document.getElementById('yearsHelp');
        doiHelp.hidden = false;
    });

    var closeHelp1 = document.getElementById('closeHelp1');
    closeHelp1.addEventListener('click', () => {
        let doiHelp = document.getElementById('yearsHelp');
        doiHelp.hidden = true;
    });

var help2 = document.getElementById('help2');
help2.addEventListener('click', () => {
    let afilHelp = document.getElementById('afilHelp');
    afilHelp.hidden = false;
});

var closeHelp2 = document.getElementById('closeHelp2');
closeHelp2.addEventListener('click', () => {
    let afilHelp = document.getElementById('afilHelp');
    afilHelp.hidden = true;
});