// Scopus.js
module.exports = {
    Scopus: class Scopus {
        constructor(name, surname, years, afiliation, DOI) {
            this.name = name;
            this.surname = surname;
            this.years = years;
            this.afiliation = afiliation;
            this.DOI = DOI;
        }

        getUrl() {
            let res = "https://api.elsevier.com/content/search/scopus?query=";
            if (this.DOI) {
                res += "DOI(" + this.DOI + ")";
            } else {
                res += "AUTHOR-NAME(" + this.surname + ", " + this.name + ")";
                if (this.years) {
                    res += ", PUBYEAR = " + this.years;
                }
                if (this.afiliation) {
                    res += ", AFFILORG(" + this.afiliation + ")";
                }
            }
            res += "&view=COMPLETE&apiKey=" + apiKey + "&httpAccept=application/json";
            console.log(res);
            return url.parse(res);
        }
    }
};