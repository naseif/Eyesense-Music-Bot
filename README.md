<p align="center">
  <b>Eyesense-Music-Bot </b><br>
  <a href="https://discord.com/oauth2/authorize?client_id=881856452157898842&scope=applications.commands%20bot&permissions=536079414">Invite</a> |
  <a href="https://discord.gg/JCdpeeNP9N">Support</a> 
  <br><br>
  <img width="300" height="300" src="https://cdn.discordapp.com/attachments/506267292993191947/896386593181560873/eyesense.png">
</p>

<p align="center">
<img src="https://img.shields.io/github/license/naseif/Eyesense-Music-Bot?style=flat-square">
  <img src="https://img.shields.io/github/issues/naseif/Eyesense-Music-Bot?style=flat-square">
  <img src="https://img.shields.io/github/issues-pr/naseif/Eyesense-Music-Bot?style=flat-square">
</p>

<p align="center">
<b>Eyesense is a feature-rich discord bot that plays music from various platforms and more. <br>
  The bot is still in the development phase. You can check the release page for the stable releases.</b>
  
</p>

## Features

- Support for slash commands 💯
- <p>Support for <img width="20" height="20" src="https://cdn.discordapp.com/attachments/547844388492148737/904716610034610207/soundcloud-logo-soundcloud-icon-transparent-png-1.png"> <img width="20" height="20" src="https://cdn.discordapp.com/attachments/547844388492148737/904660894347296798/file-spotify-logo-png-4.png"> <img width="20" height="20" src="https://cdn.discordapp.com/attachments/547844388492148737/904665487860973588/hd-youtube-logo-png-transparent-background-20.png"></p>
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
if you are having problems installing sodium or libsodium-wrappers, make sure to install the following packages `sudo apt-get install autoconf make automake g++ libtool -y`

## Configuration

### What you will need:

- Your own Bot token
- prefix
- [mongodb url](https://account.mongodb.com/account/login) 
- genius ApiKey (For lyrics <optional>) 
- TMDb Key (For tv and movie search <optional>)

First you need to create a new application in the [Discord Developer Portal](https://discord.com/developers/applications) and then create a bot to get your own discord Token and invite the bot to your server. A complete guide is available on [here](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot). 

Once you got your key, rename `config.example.json` to `config.json`. Now open the `config.json` file and add your data.

Once you are done, you can now start the bot by running the following: 
```node index.js```

### <p><img width="20" height="20" src="https://cdn.discordapp.com/attachments/547844388492148737/904660894347296798/file-spotify-logo-png-4.png">  Spotify Configuration</p>
  
Since play-dl is being used as alternative for ytdl-core, a manual configuration for spotify is needed. You can find the instructions [here](https://github.com/play-dl/play-dl/discussions/64)
  

### <p><img width="20" height="20" src="https://cdn.discordapp.com/attachments/547844388492148737/904716610034610207/soundcloud-logo-soundcloud-icon-transparent-png-1.png"> Soundcloud Configuration</p>
  
As of this moment, there is no need to configure soundcloud manuely after play-dl latest update!
### Recommendation

Use pm2 to run the bot in the background and automatically restart it when e.g. your server has internet issues:

Simply install the pm2 package globally using ```npm i pm2 -g``` and then instead of ```node index.js``` run ```pm2 start index.js```


## Contributions

Software contributions are welcome. If you are not a dev, testing and reporting bugs can also be very helpful!

## Questions?

Please open an issue if you have questions, wish to request a feature, etc.
