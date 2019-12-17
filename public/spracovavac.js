var searchByDOI = document.getElementById('doiSearch');
searchByDOI.addEventListener('click', () => {
    var elemsA = document.getElementsByClassName('A');
    var elemsB = document.getElementsByClassName('B');

    for (let i = 0, len = elemsA.length | 0; i < len; i = i + 1 | 0) {
        elemsA[i].hidden = searchByDOI.checked;
    }
    ;

    for (let i = 0, len = elemsB.length | 0; i < len; i = i + 1 | 0) {
        elemsB[i].hidden = !searchByDOI.checked;
    }
    ;
});

var searchBtn = document.getElementById('send');
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    let form = document.getElementById('uvodnyFormular');
    form.hidden = true;

    let doiSearch = document.getElementById('doiSearch').checked;
    socket.emit('uvodnyFormular', {
        searchByDOI: doiSearch,//document.getElementById('doiSearch').checked,
        DOI: (doiSearch) ? document.getElementById('DOI').value : '',
        name: (doiSearch) ? '' : document.getElementById('name').value,
        surname: (doiSearch) ? '' : document.getElementById('surname').value,
        years: (doiSearch) ? '' : document.getElementById('years').value,
        afiliation: (doiSearch) ? '' : document.getElementById('afiliation').value
    });
});

var help1 = document.getElementById('help1');
help1.addEventListener('click', () => {
    let doiHelp = document.getElementById('yearsHelp');
    doiHelp.hidden = false;
    help1.hidden = true;
});

var closeHelp1 = document.getElementById('closeHelp1');
closeHelp1.addEventListener('click', () => {
    let doiHelp = document.getElementById('yearsHelp');
    doiHelp.hidden = true;
    help1.hidden = false;
});

var help2 = document.getElementById('help2');
help2.addEventListener('click', () => {
    let afilHelp = document.getElementById('afilHelp');
    afilHelp.hidden = false;
    help2.hidden = true;
});

var closeHelp2 = document.getElementById('closeHelp2');
closeHelp2.addEventListener('click', () => {
    let afilHelp = document.getElementById('afilHelp');
    afilHelp.hidden = true;
    help2.hidden = false;
});
