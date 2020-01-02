// Scopus.js
module.exports = {
    Translator: class Translator {
        constructor() {
            this.apiKey = null;
        }

        getData() {
            return {data:"DATA"}
        }

        getUrl() {
            let res = "https://api.elsevier.com/content/search/scopus?query=";
            //TODO generate url via WOS documentation
            console.log(res);
            return url.parse(res);
        }
    }
};
