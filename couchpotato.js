'use strict';

var CouchPotatoAPI = require('./lib/couchpotato-api');
var TelegramBot = require('node-telegram-bot-api');
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

bot.onText(/\/[Ss]earch (.+)/, function (msg, match) {
	var chatId = msg.chat.id;
	var movieName = match[1];

	couchpotato.get("movie.search", { "q": movieName }).then(function (result) {
		
		console.log('search: sending ' + chatId + ' a request to add a movie ' + movieName);
		
		// create keyboard choices
		var keyboardOpts = [];
	    	_.forEach(result.movies, function(n, key) {
			keyboardOpts.push(new Array('/add ' + n.original_title + ' (' + n.year + '/' + n.imdb + ')'));
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
	}).catch(function (err) {
		console.log(err);
		bot.sendMessage(chatId, 'search: error searching movie');
	});
});

bot.onText(/\/add (.+)([\d]{4})\/(tt[\d]+)/, function (msg, match) {
	var chatId = msg.chat.id;
	var movieName = match[1].slice(0,-2);
	var movieYear = match[2];
	var movieId = match[3];

	couchpotato.get("movie.add", { "identifier": movieId, "title": movieName }).then(function (result) {
		
		console.log('add: sending ' + chatId + ' a request to add ' + movieName + ' (' + movieId + ')');
		
		couchpotato.get("media.get", { "id": movieId }).then(function (result) {	
			
			var moviePoster = result.media.info.images.poster[0];
			
			console.log('add: sending ' + chatId + ' a poster ' + moviePoster);
			
			var opts = {
				"parse_mode": "Markdown",
				"reply_to_message_id": msg.message_id,
				"one_time_keyboard": true,
				"resize_keyboard": false,
				"selective": 2,
				//"force_reply": true,
				"reply_markup": JSON.stringify({ "hide_keyboard": true })
			};

			bot.sendMessage(chatId, '[Movie added!](' + moviePoster + ')', opts);
		}).catch(function (err) {
			console.log(err);
			bot.sendMessage(chatId, 'add: error getting artwork');
		});
	
	}).catch(function (err) {
		console.log(err);
		bot.sendMessage(chatId, 'add: error adding movie');
	});
});

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
