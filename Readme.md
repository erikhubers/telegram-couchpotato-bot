# telegram-couchpotato-bot

Bot which lets you or others add movies to [CouchPotato](https://couchpota.to/).

Contact [@BotFather](http://telegram.me/BotFather) on Telegram to get a bot token.

## Usage

Make sure you have node and npm installed then

**Clone the repo**
```bash 
$ git clone https://github.com/onedr0p/telegram-couchpotato-bot
```

**Install the dependencies**
```bash 
$ cd telegram-couchpotato-bot && npm install
```

Then create the file **config.json** in the root folder (alongside couchpotato.js) with your configuration values

```javascript
{
	"telegram": {
		"botToken": ""
	},
	"couchpotato": {
		"hostname": "", 
		"apiKey": "",
		"port": 5050, 
		"urlBase": "", 
		"ssl": false,
		"username": "",
		"password": ""
	}
}
```

Please refer to the CouchPotato specific configuration below:

- **hostname**: hostname where CouchPotato runs (required)
- **apiKey**: Your API to access CouchPotato (required)
- **port**: port number CouchPotato is listening on (optional, default: 5050)
- **urlBase**: URL Base of CouchPotato (optional, default: null)
- **ssl**: Set to true if you are connecting via SSL (default: false)
- **username**: HTTP Auth username (default: null)
- **password**: HTTP Auth password (default: null)


**Start the bot with node, forever, pm2 or w/e**
```bash
$ node couchpotato.js
```

**Add a movie :) send a message to the bot you created**

`/search ernest goes to`

![Ernest 1](http://i.imgur.com/rkXQVIz.png)

![Ernest 2](http://i.imgur.com/lzi3h5d.png)
