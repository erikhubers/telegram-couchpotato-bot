var logger = require(__dirname + '/../lib/logger');
var configFile = __dirname + '/../config.json';

var config;

try {
  logger.info('config file found %s', configFile);
  config = require(configFile);
} catch (err) {
  logger.info('config file not found');
  config = {};
  config.telegram = {};
  config.bot = {};
  config.couchpotato = {};
}

/*
 * set up config options, they can be passed in thru the enviroment
 */
config.telegram.botToken = config.telegram.botToken || process.env.TELEGRAM_BOTTOKEN;

config.bot.password = config.bot.password || process.env.BOT_PASSWORD || '';
config.bot.owner = config.bot.owner || process.env.BOT_OWNER || 0;
config.bot.maxResults = config.bot.maxResults || process.env.BOT_MAXRESULTS || 15;

config.couchpotato.hostname = config.couchpotato.hostname || process.env.COUCHPOTATO_HOST || 'localhost';
config.couchpotato.apiKey = config.couchpotato.apiKey || process.env.COUCHPOTATO_APIKEY;
config.couchpotato.port = config.couchpotato.port || process.env.COUCHPOTATO_PORT || 5050;
config.couchpotato.urlBase = config.couchpotato.urlBase || process.env.COUCHPOTATO_URLBASE;
config.couchpotato.ssl = config.couchpotato.ssl || process.env.COUCHPOTATO_SSL || false;
config.couchpotato.username = config.couchpotato.username || process.env.COUCHPOTATO_USERNAME;
config.couchpotato.password = config.couchpotato.password || process.env.COUCHPOTATO_PASSWORD;

module.exports = config;
