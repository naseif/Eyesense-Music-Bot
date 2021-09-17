# Eyesense-Music-Bot
![](https://img.shields.io/github/license/naseif/Eyesense-Music-Bot?style=flat-square) ![](https://img.shields.io/github/issues/naseif/Eyesense-Music-Bot?style=flat-square)
![](https://img.shields.io/github/issues-pr/naseif/Eyesense-Music-Bot?style=flat-square)

Eyesense is a feature-rich discord bot that plays music from various platforms and more. <br>
The bot is still in the development phase You can check the release page for the stable releases
## Features

- Support for slash commands 💯
- Support for Youtube, Spotify and Soundcloud 🎧
- Can run on multiple servers at the same time 🚀
- Moderation Commands 🔨
- and more ⌛️ 


## Commands 

|        Name         |                           Description                            |
|:--------------------|:----------------------------------------------------------------:|
|    **/addrole**     |                      adds a role for a user                      |
|      **/ban**       |                   Bans a user from the server                    |
| **/deletemessages** |                   deletes x number of messages                   |
|      **/kick**      |                   kicks a user from the server                   |
|     **/region**     | changes the region of the voice channel the user is connected to |
|   **/regionbyid**   |           changes a voice channel region by channel id           |
|   **/removerole**   |                    removes a role for a user                     |
|   **/servericon**   |                     chnages the server icon!                     |
|     **/unban**      |                      unbans a user with id                       |
|    **/highfive**    |                       sends a highfive gif                       |
|      **/hug**       |                         sends a hug gif                          |
|     **/waifu**      |                        gets waifu pic :P                         |
|   **/whatanime**    |     Scans an Image to get the anime name! <whatanime 'link'>     |
|     **/8ball**      |                  ask the magic ball a question!                  |
|     **/insult**     |                     insult your fav user <3                      |
|      **/joke**      |                       gets a random joke!                        |
|   **/useravatar**   |                     Sends the user's avatar                      |
|      **/help**      |            Shows all available commands for this bot!            |
|    **/nickname**    |            Changes your own nickname or other user's             |
|     **/perms**      |       Shows the permission for another member or your own        |
|      **/ping**      |              ping the bot connection to the server               |
|  **/serverstats**   |                Shows some stats about the server                 |
|     **/summon**     |              ping the bot connection to the server               |
|     **/uptime**     |                 Since how long the bot is online                 |
|      **/back**      |               plays previous track from the queue                |
|     **/clear**      |                      clears the music queue                      |
|   **/disconnect**   |                   disconnects from the channel                   |
|     **/lyrics**     |               gets the lyrics of the current song                |
|   **/nowplaying**   |                   shows the current music name                   |
|     **/pause**      |                         pauses the song                          |
|      **/play**      |                     plays music from Youtube                     |
|   **/listqueue**    |                     Shows the current queue                      |
|      **/loop**      |                     repeats the current song                     |
|     **/resume**     |                         resumes the song                         |
|      **/seek**      |           seeks the current song to the given position           |
|    **/shuffle**     |                     shuffles the music queue                     |
|      **/skip**      |                   skips a song from the queue                    |
|      **/stop**      |                  stops the current song playing                  |

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
if you are having problems installing soduim, make sure to install the following packages `apt-get install autoconf automake g++ libtool`

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
