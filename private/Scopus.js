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

            console.log(data);

            let results = data['search-results'];

            if (results['opensearch:totalResults'] == 0){
                return {numberOfResults: 0, source: "Scopus"};
            }

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
                        affiliation: element['affiliation'],
                        volume: element['prism:volume'],
                        pages: element['prism:pageRange'],
                        issue: element['prism:issueIdentifier'],
                        citationCount: element['citedby-count'],
                        doi:element['prism:doi'],
                        authors: authors,
                        scopusId: element['dc:identifier'].split(':')[1]                      
                    }
                );

                
            });
            parsedData.publications = entry;
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
                    let y = years.trim().split('-');
                    if (y.length === 1){
                        res += " AND PUBYEAR = " + y[0];
                    } else if (y[0] === "") {
                        res += " AND PUBYEAR < " + (parseInt(y[1])+1);
                    } else if (y[1] === "") {
                        res += " AND PUBYEAR > " + (parseInt(y[0])-1);
                    } else {
                        res += " AND PUBYEAR > " + (parseInt(y[0])-1) + " AND PUBYEAR < " + (parseInt(y[1])+1);
                    }  
                }
                if (affiliation) {
                    let affil = affiliation.split("&&");
                    affil.map(x => x.trim());
                    affil = affil.join("OR");
                    res += " AND AFFILORG(" + affil + ")";
                }
            }
            res += "&view=COMPLETE&apiKey=" + this.apikey + "&httpAccept=application/json";
            console.log(res);
            return url.parse(res);
        }

        getCitationUrl(scopusId) {
            let res = "https://api.elsevier.com/content/abstract/citations?scopus_id=";
            res += scopusId + "&citation=exclude-self&apiKey=" + this.apikey + "&httpAccept=application/json";
            return url.parse(res);
        }

        async getCitationResults(url) {
            let result = {};
            await fetch(url)
                .then(response => response.json())
                .then(response => this.parseCitations(response))
                .then(response => result = response);
            return result;

        }

        parseCitations(data) {

            //return data;

            let results = data['abstract-citations-response'];

            let parsedData = {
                index: results['h-index'],
            };

            results['identifier-legend'].identifier.forEach(element => {
                let publication = {};
                publication.doi = element['prism:doi'];
                publication.pii = element['pii'];

                parsedData.publication = publication;
            });
            
            let citations = [];
            results.citeInfoMatrix.citeInfoMatrixXML.citationMatrix.citeInfo.forEach(element => {
                let authors = [];
                element.author.forEach(author => {
                    authors.push({
                      name:author['index-name'],
                      surname:author['surname'],
                      initials:author['initials']
                    })
                });

                citations.push({
                    title: element['dc:title'],
                    year: element['sort-year'],
                    source: "Scopus",
                    volume: element['prism:volume'],
                    pages: element['prism:pageRange'],
                    issue: element['prism:issueIdentifier'],
                    issn: element['prism:issn'],
                    publicationName: element['prism:publicationName'],
                    type: element['citationType']['$'],
                    authors: authors,
                    pcc: element['pcc'],
                    cc: element['cc'],
                    lcc: element['lcc'],
                    rangeCount: element['rangeCount'],
                    rowTotal: element['rowTotal'],
                });

                
            });
            parsedData.citations = citations;

            return parsedData;
        }
    }


};