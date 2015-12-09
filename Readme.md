# telegram-couchpotato-bot

Bot which lets you or others add movies to [CouchPotato](https://couchpota.to/).

Contact [@BotFather](http://telegram.me/BotFather) on Telegram to create and get a bot token.

For now, please make your bot username something unique. For example @fred-flintstone-stonepotato-bot or something

## Setup

Make sure you have node, npm, and git installed then in shell / command prompt

**Clone the repo**
```bash
git clone https://github.com/onedr0p/telegram-couchpotato-bot
```

**Install the dependencies**
```bash
cd telegram-couchpotato-bot && npm install
```

Then move `config.json.template` to `config.json` and fill in the values.

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

## Usage

Send the bot a message with the movie name

`/s ernest goes to`

The bot will reply with

```
Found 5 movies:
1) Ernest Goes to Camp - 1987 - 5.4/10 - 92m
2) Ernest Goes to Jail - 1990 - 5.3/10 - 81m
3) Ernest Goes to Africa - 1997 - 4.7/10 - 90m
4) Ernest Goes to School - 1994 - 4.5/10 - 89m
5) Ernest Goes to Splash Mountain - 1989 - 6.7/10 - 21m

/m [number] to continue...
```

Finally the bot will ask you for the quality

```
1) SD 2) HD 3) Screener 4) R5 5) DVD-Rip 6) BR-Rip 7) 720p 8) 1080p 9) BR-Disk 10) DVD-R 11) TeleCine 12) TeleSync 13) Cam

/p [number] to continue...
```

## Changelog

### v0.1.2
- Updated couchpotato lib
- Added config template to project

### v0.1.1
- Added support for profiles (qualities)
- Completely overhauled the way to add movies
- Added short commands /s for search /m for movie and /p for profile you can still use long commands

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
