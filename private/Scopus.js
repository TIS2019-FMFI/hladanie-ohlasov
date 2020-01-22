// Scopus.js
const
    url = require('url'),
    fetch = require('node-fetch-with-proxy'); // AT SCHOOL: fetch = require('node-fetch');
    fs = require('fs'),
    path = require('path');

module.exports = {
    Translator: class Translator {
        constructor(apiKey) {
            this.apikey = apiKey//JSON.parse(fs.readFileSync(path.resolve(__dirname, 'config.json'))).databases.scopus.apiKey;
            this.minNumberOfResults = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'config.json'))).minNumberOfResults;
        }

        parseData(data) {

            //return data; // AK CHCEM VIDIED STRUKTURU DAT V PREHLIACACI... inak zakomentovat"

            let results = data['search-results'];

            let parsedData = {
                numberOfResults: results['opensearch:totalResults'],
                numberOfItemsPerPage: results['opensearch:itemsPerPage'],
                next: 'link' in results ? '2' in results['link'] ? '@href' in  results['link']['2'] ? results['link']['2']['@href'] : undefined : undefined : undefined
            };

            let entry = [];
            results.entry.forEach(element => {
                let authors = [];
                element.author.forEach(author => {
                    authors.push({
                      name:author['given-name'],
                      surname:author['surname'],
                      initials:author['initials']
                    })
                });
                entry.push({
                        title: element['dc:title'],
                        year: element['prism:coverDate'],
                        source: "Scopus",
                        volume: element['prism:volume'],
                        pages: element['prism:pageRange'],
                        issue: element['prism:issueIdentifier'],
                        citationCount: element['citedby-count'],
                        doi:element['prism:doi'],
                        authors: authors
                    }
                );
                parsedData.publications = entry;

            });
            return parsedData;
        }

        async getSearchResults(url) {
            let result = {};
            await fetch(url)
                .then(response => response.json())
                .then(response => this.parseData(response))
                .then(response => result = response);
            return result;

        }

        getUrl(name, surname, years, affiliation, DOI) {
            let res = "https://api.elsevier.com/content/search/scopus?query=";
            if (DOI) {
                res += "DOI(" + DOI + ")";
            } else {
                res += "AUTHOR-NAME(" + surname + ", " + name + ")";
                if (years) {
                    res += ", PUBYEAR = " + years;
                }
                if (affiliation) {
                    res += ", AFFILORG(" + affiliation + ")";
                }
            }
            res += "&view=COMPLETE&apiKey=" + this.apikey + "&httpAccept=application/json";
            return url.parse(res);
        }
    }
};