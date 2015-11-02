'use strict';

var CouchPotatoAPI = require('./lib/couchpotato-api');
var TelegramBot = require('node-telegram-bot-api');
var NodeCache = require("node-cache");
var _ = require("lodash");

var config = require('./config.json');

var bot = new TelegramBot(config.telegram.botToken, {
    polling: true
});

var couchpotato = new CouchPotatoAPI({
    hostname: config.couchpotato.hostname,
    apiKey: config.couchpotato.apiKey,
    port: config.couchpotato.port,
    urlBase: config.couchpotato.urlBase,
    ssl: config.couchpotato.ssl,
    username: config.couchpotato.username,
    password: config.couchpotato.password
});

var cache = new NodeCache();

bot.onText(/\/[Ss](earch)? (.+)/, function(msg, match) {
    var messageId = msg.message_id;
    var chatId = msg.chat.id;
    var fromId = msg.from.id;
    var movieName = match[2];

    console.log('search: ' + fromId + ' requested to add a movie ' + movieName);
    couchpotato.get("movie.search", {
            "q": movieName
        }).then(function(result) {
            if (result.movies == undefined) {
                throw new Error('could not find ' + movieName + ', try searching again');
            }

            return result.movies;
        })
        .then(function(movies) {
            var movieList = [];
            var response = ['*Found ' + movies.length + ' movies:*'];

            _.forEach(movies, function(n, key) {

                var id = key + 1;
                var title = n.original_title;
                var year = ("year" in n ? n.year : '');
                var rating = ("rating" in n ? ("imdb" in n.rating ? n.rating.imdb[0] + '/10' : '') : '');
                var movieId = ("imdb" in n ? n.imdb : n.tmdb_id);
                var thumb = ("images" in n ? ("poster" in n.images ? n.images.poster[0] : '') : '');
                var runtime = ("runtime" in n ? n.runtime : '');
                var onIMDb = ("via_imdb" in n ? true : false);

                movieList.push({
                    "id": id,
                    "title": title,
                    "year": year,
                    "rating": rating,
                    "movie_id": movieId,
                    "thumb": thumb,
                    "via_imdb": onIMDb
                });

                response.push(
                    '*' + id + '*) ' +
                    (onIMDb ? '[' + title + '](http://imdb.com/title/' + movieId + ')' : '[' + title + '](https://www.themoviedb.org/movie/' + movieId + ')') +
                    (year ? ' - _' + year + '_' : '') +
                    (rating ? ' - _' + rating + '_' : '') +
                    (runtime ? ' - _' + runtime + 'm_' : '')
                );
            });

            response.push('\n`/m [number] to continue...`');

            // set cache
            cache.set(fromId, movieList);

            return response.join('\n');
        })
        .then(function(response) {
            var opts = {
                "disable_web_page_preview": true,
                "parse_mode": "Markdown",
                "selective": 2,
            };

            bot.sendMessage(chatId, response, opts);
        }).catch(function(err) {
            bot.sendMessage(chatId, "Oh no! " + err);
        });

});

bot.onText(/\/[mM](ovie)? ([\d]{1})/, function(msg, match) {
    var messageId = msg.message_id;
    var chatId = msg.chat.id;
    var fromId = msg.from.id;
    var movieId = match[2];

    // set movie option to cache
    cache.set(fromId + 'm', movieId);

    console.log('movie: ' + fromId + ' requested to get profile list');
    couchpotato.get("profile.list")
        .then(function(result) {
            if (result.list == undefined) {
                throw new Error("could not get profiles, try searching again");
            }

            if (cache.get(fromId) == undefined) {
                throw new Error("could not get previous movie list, try searching again");
            }

            return result.list;
        })
        .then(function(profiles) {

            var profileList = [];
            var response = [];
            _.forEach(profiles, function(n, key) {
                profileList.push({
                    "id": key + 1,
                    "label": n.label,
                    "hash": n._id
                });

                response.push('*' + (key + 1) + '*) ' + n.label);
            });

            response.push('\n\n`/p [number] to continue...`');

            // set cache
            cache.set("profiles", profileList);

            return response.join(' ');
        })
        .then(function(response) {
            bot.sendMessage(chatId, response, {
                "selective": 2,
                "parse_mode": "Markdown"
            });
        })
        .catch(function(err) {
            bot.sendMessage(chatId, "Oh no! " + err);
        });
});

bot.onText(/\/[pP](rofile)? ([\d]{1})/, function(msg, match) {
    var messageId = msg.message_id;
    var chatId = msg.chat.id;
    var fromId = msg.from.id;
    var profileId = match[2];
    var profileList = cache.get("profiles");
    var movieId = cache.get(fromId + 'm');
    var movieList = cache.get(fromId);

    if (profileList == undefined || movieList == undefined || movieId == undefined) {
        bot.sendMessage(chatId, 'Oh no! Error: something went wrong, try searching again');
    }

    var movie = _.filter(movieList, function(item) {
        return item.id == movieId;
    })[0];

    var profile = _.filter(profileList, function(item) {
        return item.id == profileId;
    })[0];

    console.log('movie: ' + fromId + ' requested to get add the movie ' + movie.title);

    couchpotato.get("movie.add", {
            "identifier": movie.movie_id,
            "title": movie.title,
            "profile_id": profile.hash
        })
        .then(function(result) {
            if (result.success == false) {
                throw new Error("could not add movie, try searching again.");
            }

            bot.sendMessage(chatId, '[Movie added!](' + movie.thumb + ')', {
                "selective": 2,
                "parse_mode": "Markdown"
            });
        })
        .catch(function(err) {
            bot.sendMessage(chatId, "Oh no! " + err);
        })
        .finally(function() {

            // delete cache items
            cache.del(fromId);
            cache.del(fromId + 'm');
            cache.del("profiles");
        });

});
