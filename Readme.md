# telegram-couchpotato-bot

Bot which lets you or others add movies to [CouchPotato](https://couchpota.to/) via the messaging service [Telegram](https://telegram.org/).

Contact [@BotFather](http://telegram.me/BotFather) on Telegram to create and get a bot token.

For now, please make your bot username something unique. For example @fred-flintstone-stonepotato-bot or something

Getting Started
---------------

### Prerequisites
- [Node.js](http://nodejs.org)
- [Git](https://git-scm.com/downloads) (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/onedr0p/telegram-couchpotato-bot
```

```bash
# Install dependencies
cd telegram-couchpotato-bot
npm install
```

Then copy `config.json.template` to `config.json` and fill in the values.

Please refer to the CouchPotato specific configuration below:

- **hostname**: hostname where CouchPotato runs (required)
- **apiKey**: Your API to access CouchPotato (required)
- **port**: port number CouchPotato is listening on (optional, default: 5050)
- **urlBase**: URL Base of CouchPotato (optional, default: empty)
- **ssl**: Set to true if you are connecting via SSL (default: false)
- **username**: HTTP Auth username (default: empty)
- **password**: HTTP Auth password (default: empty)

```bash
# Start the bot
node couchpotato.js
```

### Docker
Alternatively you may use Docker to start the bot
```
docker run --name telegram-couchpotato-bot \
  -e TELEGRAM_BOTTOKEN=
  -e COUCHPOTATO_HOST=
  -e COUCHPOTATO_APIKEY=
  -e COUCHPOTATO_PORT=
  -e COUCHPOTATO_URLBASE=
  -e COUCHPOTATO_SSL=
  -e COUCHPOTATO_USERNAME=
  -e COUCHPOTATO_PASSWORD=
  telegram-couchpotato-bot
```

**Prebuilt** Docker image for this bot can be found [here](https://hub.docker.com/r/subzero79/docker-telegram-couchpotato-bot), thanks [@subzero79](https://github.com/subzero79)

### Usage

Send the bot a message with the movie name

`/q ernest goes to`

The bot will reply with

```
Found 5 movies:
1) Ernest Goes to Camp - 1987 - 5.4/10 - 92m
2) Ernest Goes to Jail - 1990 - 5.3/10 - 81m
3) Ernest Goes to Africa - 1997 - 4.7/10 - 90m
4) Ernest Goes to School - 1994 - 4.5/10 - 89m
5) Ernest Goes to Splash Mountain - 1989 - 6.7/10 - 21m
```

Use the custom keyboard to select the movie.

![Step One](https://i.imgur.com/BDgQiGP.png)

The bot will then ask you for the quality

```
1) Any 2) Screener 3) DVD-Rip 4) BR-Rip 5) 720p 6) 1080p
```

Send the profile using the custom keyboard

![Step Two](https://i.imgur.com/V0is1eG.png)

If everything goes well, you'll see a text from the bot saying the movie was added.

![Step Three](https://i.imgur.com/tTTv3ir.png)

### Changelog

#### v0.1.8
- Quality Profiles options only display ones that are enabled in CouchPotato
- More Housekeeping

#### v0.1.7
- Added custom keyboard, thanks @bybeet

#### v0.1.6
- Added command `/searchwanted` for searching for all wanted movies
- Added command `/clear` to wipe all previous commands chain
- More housekeeping

#### v0.1.5
- CouchPotato lib is now on npm (you will need to run npm install if you are upgrading)
- Updated a few dev things

#### v0.1.4
- Added docker support
- Fixed domain names no verifying
- Updated Readme.md
- Thanks @danielcbaldwin

#### v0.1.3
- Change /s flag to /q (/query) flag
- Updated cache keys
- Added count of profiles to reponse

#### v0.1.2
- Updated couchpotato lib
- Added config template to project

#### v0.1.1
- Added support for profiles (qualities)
- Completely overhauled the way to add movies
- Added short commands /s for search /m for movie and /p for profile you can still use long commands

#### v0.1.0
- Initial release

### License
(The MIT License)

Copyright (c) 2015 Devin Buhl <devin.kray@gmail.com>

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
