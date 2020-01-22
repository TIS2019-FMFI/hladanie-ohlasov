// Scopus.js
const
    url = require('url'),
    fs = require('fs'),
    path = require('path');

module.exports = {
    Translator: class Translator {
        constructor(apiKey) {
            this.apikey = apiKey//JSON.parse(fs.readFileSync(path.resolve(__dirname, 'config.json'))).databases.scopus.apiKey;
        }

        parseData(data) {
            let results = data['search-results'];
            let parsedData = {
                numberOfResults: results['opensearch:totalResults']
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
            console.log(res);
            return url.parse(res);
        }
    }
};