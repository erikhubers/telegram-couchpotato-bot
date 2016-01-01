'use strict';

var CouchPotatoAPI = require('couchpotato-api');
var TelegramBot = require('node-telegram-bot-api');
var NodeCache = require('node-cache');
var _ = require('lodash');

class Response {
    constructor(message, keyboard) {
      this.message = message;
      this.keyboard = keyboard;
    }
}

var state = {
  MOVIE: 1,
  PROFILE: 2
};

try {
  var config = require('./config.json');
} catch (e) {
  var config = {};
  config.telegram = {};
  config.couchpotato = {};
}

var bot = new TelegramBot(process.env.TELEGRAM_BOTTOKEN || config.telegram.botToken, {
  polling: true
});

var couchpotato = new CouchPotatoAPI({
  hostname: process.env.COUCHPOTATO_HOST || config.couchpotato.hostname,
  apiKey: process.env.COUCHPOTATO_APIKEY || config.couchpotato.apiKey,
  port: process.env.COUCHPOTATO_PORT || config.couchpotato.port || 5050,
  urlBase: process.env.COUCHPOTATO_URLBASE || config.couchpotato.urlBase,
  ssl: process.env.COUCHPOTATO_SSL || config.couchpotato.ssl,
  username: process.env.COUCHPOTATO_USERNAME || config.couchpotato.username,
  password: process.env.COUCHPOTATO_PASSWORD || config.couchpotato.password
});

var cache = new NodeCache();

/*
get the bot name
 */
bot.getMe()
  .then(function(msg) {
    console.log('Welcome to the couchpotato bot %s!', msg.username);
  })
  .catch(function(err) {
    throw new Error(err);
  });

/*
handle start command
 */
bot.onText(/\/start/, function(msg) {
  var chatId = msg.chat.id;
  var username = msg.from.username || msg.from.first_name;

  var response = [];

  response.push('Hello ' + username + ', use /q to search');
  response.push('\n`/q [movie name]` to continue...');

  var opts = {
    'parse_mode': 'Markdown',
    'selective': 2,
  };

  bot.sendMessage(chatId, response.join('\n'), opts);
});

/*
handle query command
 */
bot.onText(/\/[Qq](uery)? (.+)/, function(msg, match) {
  var chatId = msg.chat.id;
  var fromId = msg.from.id;
  var movieName = match[2];
  var mCount = 0

  couchpotato.get('movie.search', { 'q': movieName })
    .then(function(result) {
      if (result.movies === undefined) {
        throw new Error('could not find ' + movieName + ', try searching again');
      }

      return result.movies;
    })
    .then(function(movies) {
      console.log(fromId + ' requested to search for movie ' + movieName);

      var movieList = [];
      mCount = movies.length
      var message = ['*Found ' + mCount + ' movies:*'];
      var keyboardList = [];

      _.forEach(movies, function(n, key) {

        var id = key + 1;
        var title = n.original_title;
        var year = ('year' in n ? n.year : '');
        var rating = ('rating' in n ? ('imdb' in n.rating ? n.rating.imdb[0] + '/10' : '') : '');
        var movieId = ('imdb' in n ? n.imdb : n.tmdb_id);
        var thumb = ('images' in n ? ('poster' in n.images ? n.images.poster[0] : '') : '');
        var runtime = ('runtime' in n ? n.runtime : '');
        var onIMDb = ('via_imdb' in n ? true : false);
        var keyboardValue = title + (year ? ' - ' + year : '');

        movieList.push({
          'id': id,
          'title': title,
          'year': year,
          'rating': rating,
          'movie_id': movieId,
          'thumb': thumb,
          'via_imdb': onIMDb,
          'keyboard_value': keyboardValue
        });

        message.push(
          '*' + id + '*) ' +
          (onIMDb ? '[' + title + '](http://imdb.com/title/' + movieId + ')' : '[' + title + '](https://www.themoviedb.org/movie/' + movieId + ')') +
          (year ? ' - _' + year + '_' : '') +
          (rating ? ' - _' + rating + '_' : '') +
          (runtime ? ' - _' + runtime + 'm_' : '')
        );

        // One movie per row of custom keyboard
        keyboardList.push([keyboardValue]);
      });
      message.push('\nPlease select from the menu below.');

      // set cache
      cache.set('movieList' + fromId, movieList);
      cache.set('state' + fromId, state.MOVIE);

      return new Response(message.join('\n'), keyboardList);
    })
    .then(function(response) {
      var keyboard = {
        keyboard: response.keyboard,
        one_time_keyboard: true
      };
      var opts = {
        'disable_web_page_preview': true,
        'parse_mode': 'Markdown',
        'selective': 2,
        'reply_markup': JSON.stringify(keyboard),
      };
      //console.log(opts)
      bot.sendMessage(chatId, response.message, opts);
    })
    .catch(function(err) {
      replyWithError(chatId, err);
    });

});

/*
 Captures any and all messages, filters out commands, handles profiles and movies
 sent via the custom keyboard.
 */
bot.on('message', function(msg) {
  var chatId = msg.chat.id;
  var fromId = msg.from.id;
  // If the message is a command, ignore it.
  if(msg.text[0] != '/') {
    // Check cache to determine state, if cache empty prompt user to start a movie search
    var currentState = cache.get('state' + fromId);
    if (currentState === undefined) {
      replyWithError(chatId, new Error('Try searching for a movie first with `/q movie name`'));
    } else {
      switch(currentState) {
        case state.MOVIE:
          var movieDisplayName = msg.text;
          handleMovie(chatId, fromId, movieDisplayName);
          break;
        case state.PROFILE:
          var profileName = msg.text;
          handleProfile(chatId, fromId, profileName);
          break;
        default:
          replyWithError(chatId, new Error('Unsure what\'s going on, use the `/clear` command and start over.'));
      }
    }
  }
});

function handleMovie(chatId, fromId, movieDisplayName) {
  var movieList = cache.get('movieList' + fromId);
  if (movieList === undefined) {
    replyWithError(chatId, new Error('something went wrong, try searching again'));
  }
  var movie = _.filter(movieList, function(item) {
    return item.keyboard_value == movieDisplayName;
  })[0];
  if(movie === undefined){
    replyWithError(chatId, new Error('Could not find the movie with title "' + movieDisplayName + '"'));
  }

  var movieId = movie.id;

  // set movie option to cache
  cache.set('movieId' + fromId, movieId);

  couchpotato.get('profile.list')
    .then(function(result) {
      if (result.list === undefined) {
        throw new Error('could not get profiles, try searching again');
      }

      if (cache.get('movieList' + fromId) === undefined) {
        throw new Error('could not get previous movie list, try searching again');
      }

      return result.list;
    })
    .then(function(profiles) {
      console.log(fromId + ' requested to get profiles list');

      var profileList = [];
      var keyboardList = [];
      var keyboardRow = [];

      // only select profiles that are enabled in CP
      var enabledProfiles = _.filter(profiles, function(item) {
        return item.hide === false;
      });

      var response = ['*Found ' + enabledProfiles.length + ' profiles:*\n'];

      _.forEach(enabledProfiles, function(n, key) {
        profileList.push({
          'id': key,
          'label': n.label,
          'hash': n._id
        });

        // Keep profile id as an integer, convert to char for display
        var keyAsChar = String.fromCharCode('A'.charCodeAt(0) + key);

        response.push('*' + (key + 1) + '*) ' + n.label);

        // Profile names are short, put two on each custom
        // keyboard row to reduce scrolling
        keyboardRow.push(n.label);
        if (keyboardRow.length == 2) {
          keyboardList.push(keyboardRow);
          keyboardRow = [];
        }
      });
      
      if (keyboardRow.length == 1 && keyboardList.length == 0) {
        keyboardList.push([keyboardRow[0]])
      }
      response.push('\n\nPlease select from the menu below.');


      // set cache
      cache.set('movieProfileList' + fromId, profileList);
      cache.set('state' + fromId, state.PROFILE);

      return new Response(response.join(' '), keyboardList);
    })
    .then(function(response) {
      var keyboard = {
        keyboard: response.keyboard,
        one_time_keyboard: true
      };
      var opts = {
        'disable_web_page_preview': true,
        'parse_mode': 'Markdown',
        'selective': 2,
        'reply_markup': JSON.stringify(keyboard),
      };
      bot.sendMessage(chatId, response.message, opts);
    })
    .catch(function(err) {
      replyWithError(chatId, err);
    });
}

function handleProfile(chatId, fromId, profileName) {
  var profileList = cache.get('movieProfileList' + fromId);
  var movieId = cache.get('movieId' + fromId);
  var movieList = cache.get('movieList' + fromId);
  if (profileList === undefined || movieList === undefined || movieId === undefined) {
    replyWithError(chatId, new Error('Error: something went wrong, try searching again'));
  }

  var profile = _.filter(profileList, function(item) {
    return item.label == profileName;
  })[0];
  if(profile === undefined){
    replyWithError(chatId, new Error('Could not find the profile "' + profileName + '"'));
  }

  var profileId = profile.id;

  var movie = _.filter(movieList, function(item) {
    return item.id == movieId;
  })[0];

  couchpotato.get('movie.add', {
      'identifier': movie.movie_id,
      'title': movie.title,
      'profile_id': profile.hash
    })
    .then(function(result) {

      console.log(fromId + ' added movie ' + movie.title);

      if (result.success === false) {
        throw new Error('could not add movie, try searching again.');
      }

      bot.sendMessage(chatId, '[Movie added!](' + movie.thumb + ')', {
        'selective': 2,
        'parse_mode': 'Markdown',
        'reply_markup': {
          'hide_keyboard': true
        }
      });
    })
    .catch(function(err) {
      replyWithError(chatId, err);
    })
    .finally(function() {
      clearCache(fromId);
    });
}

/*
 * handle full search of movies
 */
bot.onText(/\/searchwanted/, function(msg) {
  var chatId = msg.chat.id;
  var fromId = msg.from.id;

  couchpotato.get('movie.searcher.full_search')
    .then(function(result) {
      bot.sendMessage(chatId, 'Starting full search for all wanted movies.');
    }).catch(function(err) {
      replyWithError(chatId, err);
    });
});

/*
 * handle clear command
 */
bot.onText(/\/clear/, function(msg) {
  var chatId = msg.chat.id;
  var fromId = msg.from.id;

  clearCache(fromId);

  bot.sendMessage(chatId, 'All previously sent commands have been cleared, yey!', {
    'reply_markup': {
      'hide_keyboard': true
    }
  });
});

/*
 * Shared err message logic, primarily to handle removing the custom keyboard
 */
function replyWithError(chatId, err) {
  bot.sendMessage(chatId, 'Oh no! ' + err, {
    'parse_mode': 'Markdown',
    'reply_markup': {
      'hide_keyboard': false
    }
  });
}

function clearCache(fromId) {
  cache.del('movieList' + fromId);
  cache.del('movieId' + fromId);
  cache.del('movieProfileList' + fromId);
  cache.del('state' + fromId);
}
