**Unfortunately I don't use Telegram or CouchPotato anymore and won't be providing updates for this**

# telegram-couchpotato-bot

Bot which lets you or others add movies to [CouchPotato](https://couchpota.to/) via the messaging service [Telegram](https://telegram.org/).

Contact [@BotFather](http://telegram.me/BotFather) on Telegram to create and get a bot token.

Getting Started
---------------

## Prerequisites
- [Node.js](http://nodejs.org) v4.2.x
- [Git](https://git-scm.com/downloads) (optional)

## Installation

```bash
# Clone the repository
git clone https://github.com/onedr0p/telegram-couchpotato-bot
```

```bash
# Install dependencies
cd telegram-couchpotato-bot
npm install
```

```bash
# Copy acl.json.template to acl.json
cp acl.json.template acl.json
```

```bash
# Copy config.json.template to config.json
cp config.json.template config.json
```

In `config.json` fill in the values below:

Telegram:
- **botToken** your Telegram Bot token

Bot:
- **password** the password to access the bot
- **owner** your Telegram user ID. (you can fill this in later)

CouchPotato:
- **hostname**: hostname where CouchPotato runs (required)
- **apiKey**: Your API to access CouchPotato (required)
- **port**: port number CouchPotato is listening on (optional, default: 5050)
- **urlBase**: URL Base of CouchPotato (optional, default: empty)
- **ssl**: Set to true if you are connecting via SSL (default: false)
- **username**: HTTP Auth username (default: empty)
- **password**: HTTP Auth password (default: empty)

**Important note**: Restart the bot after making any changes to the `config.json` file.

```bash
# Start the bot
node couchpotato.js
```

## Usage (commands)

### First use
Send the bot the `/auth` command with the password you created in `config.json`

### Adding a movie

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

![Step One](https://raw.githubusercontent.com/onedr0p/telegram-couchpotato-bot/master/examples/step_1.png)

The bot will then ask you for the quality

```
1) Any 2) Screener 3) DVD-Rip 4) BR-Rip 5) 720p 6) 1080p
```

Send the profile using the custom keyboard

![Step Two](https://raw.githubusercontent.com/onedr0p/telegram-couchpotato-bot/master/examples/step_2.png)

If everything goes well, you'll see a text from the bot saying the movie was added.

![Step Three](https://raw.githubusercontent.com/onedr0p/telegram-couchpotato-bot/master/examples/step_3.png)

### Additional commands
* `/clear` clear all previous commands and cache

### Admin commands
* `/wanted` search all missing/wanted movies
* `/users` list users
* `/revoke` revoke user from bot
* `/unrevoke` un-revoke user from bot

## Docker
Alternatively you may use Docker to start the bot
```
docker run --name telegram-couchpotato-bot \
  -e TELEGRAM_BOTTOKEN=
  -e BOT_PASSWORD=
  -e BOT_OWNER=
  -e BOT_MAXRESULTS=
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

## License
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
