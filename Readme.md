# telegram-couchpotato-bot

Bot which lets you or others add movies to [CouchPotato](https://couchpota.to/).

Contact [@BotFather](http://telegram.me/BotFather) on Telegram to get a bot token.

## Usage

Make sure you have node, npm, and git installed then

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

![Ernest 1](http://i.imgur.com/jgJFuCX.png) ![Ernest 2](http://i.imgur.com/lzi3h5d.png)

## Changelog

### v0.1.2 *(coming soon)*
- Added support for profiles (qualities)

### v0.1.1
- Added support for `/profiles` command, more to come

### v0.1.0
- Initial release

## License
(The MIT License)

Copyright (c) 2015 Devin Buhl &lt;devin.kray@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
