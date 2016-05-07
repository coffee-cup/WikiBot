var request = require('request');
var cheerio = require('cheerio');
var Promise = require('bluebird');

var WIKI_RANDOM = 'https://en.wikipedia.org/wiki/Special:Random';
var WIKI_API = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles='

var FACT_LENGTH_LIMIT = 200;

var Wiki = {
    getRandomArticleTitle: function() {
        return new Promise(function(resolve, reject) {
            request(WIKI_RANDOM, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    $ = cheerio.load(body);
                    var articleTitle = $('#firstHeading').text();
                    resolve(articleTitle);
                } else {
                    reject(error);
                }
            });
        });
    },

    getRandomFact: function() {
        var _this = this;
        return new Promise(function(resolve, reject) {
            _this.getRandomArticleTitle().then(function(articleTitle) {
                request(WIKI_API + articleTitle.split(" ").join("%20"), function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var json = JSON.parse(body);
                        if (json.query) {
                            var page = json.query.pages[Object.keys(json.query.pages)[0]];
                            var fact = page.extract;
                            if (!fact || fact === "") {
                                return _this.getRandomFact();
                            } else {
                                if (fact.length > FACT_LENGTH_LIMIT) {
                                    var fact_splits = fact.split('.');
                                    fact = fact_splits[0] += '.';
                                    if (fact_splits.length > 1) {
                                        fact += fact_splits[1] + '.';
                                    }
                                }
                                resolve(fact);
                            }
                        }
                    }
                });
            });
        });
    }
};

module.exports = Wiki;
