// WOS.js
const
    url = require('url'),
    util = require('util'),
    fetch = require('node-fetch-with-proxy'); // AT SCHOOL: fetch = require('node-fetch');
fs = require('fs'),
    path = require('path');

const DomParser = require('dom-parser');
const xml2js = (require('xml2js'));

const {exec} = require('child_process');

String.prototype.clean = function () {
    var self = this;
    return this.replace(/(\r\n|\n|\r)/gm, "").replace(/^\s+|\s+$/g, "");
}


module.exports = {
    Translator: class Translator {
        constructor(apiKey) {
            this.apikey = apiKey//JSON.parse(fs.readFileSync(path.resolve(__dirname, 'config.json'))).databases.scopus.apiKey;
            this.minNumberOfResults = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'config.json'))).minNumberOfResults;
        }

        parseData(data) {
            //return data; // AK CHCEM VIDIED STRUKTURU DAT V PREHLIACACI... inak zakomentovat"
            let result = data['return'];
            let records = result['records'];
            let parsedData = {
                numberOfResults: result['recordsFound'][0],
                numberOfItemsPerPage: '5',
                next: undefined
            };

            let entry = [];
            records.forEach((record) => {
                let authors = [];
                record['authors'][0].value.forEach((author) => {
                    authors.push({
                        name: author.split(', ')[0],
                        surname: (author.split(', ').length > 1) ? author.split(', ')[1] : undefined
                    });
                });

                let title = record['title'][0];
                let year = record['source'][2];
                let pages = record['source'][0];
                let doi = record['other'][1];
                let pubName = record['source'][3];

                entry.push({
                    title: title['value'][0],
                    year: year['value'][0],
                    source: "WOS",
                    volume: undefined,
                    pages: pages['value'][0],
                    issue: undefined,
                    citationCount: undefined,
                    doi: doi['value'][0],
                    authors: authors,
                    pubName: pubName['value'][0]
                });
            });

            parsedData.publications = entry;
            return parsedData;

        }

        async getSearchResults(url) {

            const exec = require('child_process').exec;
            let WosSearchBashScript = (process.env.ALL_PROXY === undefined) ? 'wos --lite query "' + url + '"' : 'wos --lite --proxy ' + process.env.ALL_PROXY + ' query "' + url + '"';
            const shellScript = await exec(WosSearchBashScript);
            await shellScript.stdout.on('data', async (data) => {
                let pole = data.split('\n');
                pole.shift();
                let strippedData = pole.join('\n');
                // do whatever you want here with data
                //console.log(data);

                let self = this;
                var parser = new xml2js.Parser({stripPrefix: true});
                parser.parseStringPromise(strippedData).then(await function (result) {
                    //console.log(result);
                    return self.parseData(result);

                })
                    .catch(function (err) {
                        // Failed
                    });


            });
            shellScript.stderr.on('data', (data) => {
                console.error(data);
            });
        }

        getUrl(name, surname, years, affiliation, DOI) {
            let res = "";
            if (DOI) {
                res += "DO=" + DOI;
            } else {
                res += "AU=(" + surname + "* " + name + "*)";
                if (years) {
                    let y = years.trim().split('-');
                    if (y.length === 1) {
                        res += " AND PY=" + y[0];
                    } else if (y[0] === "") {
                        res += " AND PY=(-" + (parseInt(y[1]) + 1) + ')';
                    } else if (y[1] === "") {
                        res += " AND PY=(" + (parseInt(y[0]) - 1) + "-)";
                    } else {
                        res += " AND PY=(" + (parseInt(y[0]) - 1) + '-)' + " AND PY(-" + (parseInt(y[1]) + 1) + ')';
                    }
                }
                if (affiliation) {
                    let affil = affiliation.split("&&");
                    affil.map(x => x.trim());
                    affil = affil.join("OR");
                    res += " AND AS(" + affil + ")";
                }
            }
            return res;
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
                        name: author['index-name'],
                        surname: author['surname'],
                        initials: author['initials']
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