# Eyesense-Music-Bot
![](https://img.shields.io/github/license/naseif/Eyesense-Music-Bot?style=flat-square) ![](https://img.shields.io/github/issues/naseif/Eyesense-Music-Bot?style=flat-square)
![](https://img.shields.io/github/issues-pr/naseif/vultrDiscordBot?style=flat-square)

Eyesense is a feature-rich discord bot that plays music from various platforms and more. <br>
The bot is still in the development phase You can check the release page for the stable releases
## Features

- Support for slash commands 💯
- Support for Youtube, Spotify and Soundcloud 🎧
- Can run on multiple servers at the same time 🚀
- Moderation Commands 🔨
- and more ⌛️ 

## Requirements

- Node.js (v16.6 or higher)
- NPM

## Installation

simply clone the repo and install the packages : 

```
git clone https://github.com/naseif/Eyesense-Music-Bot.git
cd Eyesense-Music-Bot
npm i
```

## Configuration

First you need to create a new application in the [Discord Developer Portal](https://discord.com/developers/applications) and then create a bot to get your own discord Token and invite the bot to your server. Once you got your key, rename `config.example.json` to `config.json`. Now open the `config.json` file and add your discord bot tokens.

Once you are done, you can now start the bot by running the follwoing: 
```node index.js```

### Recommendation

Use pm2 to run the bot in the background and restart it on internet issues, or in case the bot crashed

Simply install the pm2 package globally using ```npm i pm2 -g``` and then instead ```node index.js``` run ```pm2 start index.js```


## Contributions

Software contributions are welcome. If you are not a dev, testing and reproting bugs can also be very helpful!

## Questions?

Please open an issue if you have questions, wish to request a feature, etc.
