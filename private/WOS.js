// Scopus.js
module.exports = {
    WOS: class WOS {
        constructor(name, surname, years, afiliation, DOI) {
            this.name = name;
            this.surname = surname;
            this.years = years;
            this.afiliation = afiliation;
            this.DOI = DOI;
        }

        getUrl() {
            let res = "https://api.elsevier.com/content/search/scopus?query=";
            //TODO generate url via WOS documentation
            console.log(res);
            return url.parse(res);
        }
    }
};
