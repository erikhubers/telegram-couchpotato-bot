'use strict';

var CouchPotatoAPI = require('./lib/couchpotato-api');
var TelegramBot = require('node-telegram-bot-api');
var Bluebird = require('bluebird');
var _ = require("lodash");

var config = require('./config.json');

var bot = new TelegramBot(config.telegram.botToken, { polling: true });

var couchpotato = new CouchPotatoAPI({
	hostname: config.couchpotato.hostname, 
	apiKey: config.couchpotato.apiKey,
	port: config.couchpotato.port, 
	urlBase: config.couchpotato.urlBase, 
	ssl: config.couchpotato.ssl,
	username: config.couchpotato.username,
	password: config.couchpotato.password
});

<<<<<<< HEAD
/*
search for movie name
 */
bot.onText(/\/[sS]earch ([^\/p|P]+)\/{0,1}[p|P]{0,1}(.*)/, function (msg, match) {
=======
bot.onText(/\/[Ss]earch (.+)/, function (msg, match) {
>>>>>>> bc27024aad68cd2682f0d4b9b9d5d20ab9a755bc
	var chatId = msg.chat.id;
	var movieName = match[1];
	var profile = match[2] || '';

	if (profile) {
		profile = '/' + profile;
	}

	console.log('search: sending ' + chatId + ' a list of ' + movieName + ' matches');

	couchpotato.get("movie.search", { "q": movieName })
	.then(function (result) {

		// create keyboard choices
		var keyboardOpts = [];
	    _.forEach(result.movies, function(n, key) {
			keyboardOpts.push(new Array('/add ' + n.original_title + ' (' + n.year + '/' + n.imdb + profile + ')'));
			if (key > 2) return false;
		});

		var opts = {
			"reply_to_message_id": msg.message_id,
			"disable_web_page_preview": true,	
			"force_reply": true,
			"resize_keyboard": false,
			"one_time_keyboard": true,
			"selective": 2,
			"reply_markup": JSON.stringify({
				"keyboard": keyboardOpts,
			})
	    };
	    	
		bot.sendMessage(chatId, 'Choose a movie to add:', opts);
	})
	.catch(function (err) {
		console.log(err);
		bot.sendMessage(chatId, 'search: error searching movie');
	});
});

/*
add movie
 */
bot.onText(/\/[aA]dd (.+)([\d]{4})\/(tt[\d]+)\/?(.+)?\)/, function (msg, match) {
	var chatId = msg.chat.id;
	var movieName = match[1].slice(0,-2);
	var movieYear = match[2];
	var movieId = match[3];
	var profileName = match[4] || '';

	console.log('add: sending ' + chatId + ' a request to add ' + movieName + ' (' + movieId + ')');

	// send the request
	Bluebird.join(_getProfile(profileName), _getThumbUrl(movieId), function(profile, thumb) {

		couchpotato.get("movie.add", { "identifier": movieId, "title": movieName, "profile_id": profile[0]._id })
		.then(function (result) {

	    	var opts = {
				"parse_mode": "Markdown",
				"reply_to_message_id": msg.message_id,
				"one_time_keyboard": true,
				"resize_keyboard": false,
				"selective": 2,
				"reply_markup": JSON.stringify({ "hide_keyboard": true })
			};

			bot.sendMessage(chatId, '[Movie added!](' + thumb + ')', opts);

		})
		.catch(function (err) {
			bot.sendMessage(chatId, 'add: error adding movie');

			throw new Error("could not add movie: " + err);
		});
	})
	.catch(function (err) {
		bot.sendMessage(chatId, 'add: error adding movie');

		throw new Error("could not add movie: " + err);
	});
});

/*
get profile names
 */
bot.onText(/\/[pP]rofiles/, function (msg) {
	var chatId = msg.chat.id;

	console.log('profiles: sending ' + chatId + ' a request get profile names');

	couchpotato.get("profile.list")
	.then(function (result) {	
		
		var profileProfiles = [];
		_.forEach(result.list, function(n, key) {
			profileProfiles.push(n.label);
		});

		bot.sendMessage(chatId, profileProfiles.join(', '));
		
	})
	.catch(function (err) {
		bot.sendMessage(chatId, 'profiles: error grabbing profiles');

		throw new Error("could not get profiles: " + err);
	});
});

/*
get profile_id by name
 */
var _getProfile = function (profileName) {
	return couchpotato.get("profile.list")
	.then(function (result) {	
		if (profileName) {
			console.log('add: found profile_id for ' + profileName);
			return  _.filter(result.list, function(item){
	  			return item.label.match(new RegExp(profileName, 'i'));
			});
		} else {
			return Object.keys(result.list)[0];
		}
	})
	.catch(function (err) {
		throw new Error("could not get profiles: " + err);
	});
};

/*
get thumbnail link
 */
var _getThumbUrl = function (movieId) {
	return couchpotato.get("media.get", { "id": movieId })
	.then(function (result) {
		var thumb =  result.media.info.images.poster[0]
		return thumb;
	})
	.catch(function (err) {
		throw new Error("could not get thumb url: " + err);
	});	
}

