module.exports = {
    Publication: class Publication {
        constructor(year, source, volume, pages, issue, authors, citationCount) {
            this.year = year;
            this.source = source;
            this.volume = volume;
            this.pages = pages;
            this.issue = issue;
            this.authors = authors;
            this.citationCount = citationCount;
        }
    }
};