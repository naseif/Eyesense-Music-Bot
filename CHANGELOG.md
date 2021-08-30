# Changelog

## 4.0.0 (28/08/2021)

- [New] Added an option to search for lyrics instead of searching only for the current song. Also added an if statment to check if there are parentheses in the current.title and slicing if found to improve automatic lyric search | (@naseif)
- [Enhancement] Deleted stop command since it destroys the queue, pause and resume are are a good replacement | (@naseif)
- [Fix] Fixed embed message not sending messages | (@naseif)
- [Enhancement] Added another embed message for the play command (Ups!) | (@naseif)
- [Fix] Removed github link from author embed property | (@naseif)
- [Enhancement] Added embe messages for possible errors from play command | (@naseif)
- [New] Added lyrics command which gets the lyrics for the current playing song | (@naseif)
- [Enhancement] Added ytdl options for much faster audio playback | (@naseif)

---

## 3.0.0 (28/08/2021)

- [New] Added 8ball command ;) | (@naseif)
- [New] Added removerole command (only works for users with ADMINSTRAITOR flag!) | (@naseif)
- [New] addrole command adde (Works only with users who have ADMINISTRATOR flag!) | (@naseif)
- deprecated opusscript and replaced it with @discordjs/opus for better performance,, added zlib-sync for much faster websocket connections | (@naseif)
- [New] Added guildCreate event which triggers commands registering when the bot joins a new server | (@naseif)
- [Debugging] Seek command not working as excepted | (@naseif)
- [New] Added get user Avatar command | (@naseif)
- [New] Added deleteMessages command | (@naseif)
- [New] Added kick member command | (@naseif)
- [New] Added ban user command | (@naseif)
- [New] Added ping command! | (@naseif)
- [New] Added new funny commands | (@naseif)

---

## 2.0.0 (26/08/2021)

- [[Fix] fixed embed messages not being sent because they are empty](https://github.com/naseif/Eyesense-Music-Bot/commit/7f227c1b76a7ffe3eeb3cd2ad470040133468ae4) - @naseif
- [[Update] updated all commands embed messages](https://github.com/naseif/Eyesense-Music-Bot/commit/3337541158691ede7dc7a008e2a2a1e7ec00a905) - @naseif
- [[New] Added embedMessage Function to return embed template instead of bloating command files, replaced embed objects with the function](https://github.com/naseif/Eyesense-Music-Bot/commit/b2e872b49cfebbb94d01e6719f761e91942a964a) - @naseif
- [[Enhancement] More embed messages...](https://github.com/naseif/Eyesense-Music-Bot/commit/bdb761e79a30d03dc6586177c141a1d81d610343) - @naseif
- [[Enhancement] /back embed message added](https://github.com/naseif/Eyesense-Music-Bot/commit/ff90d682e84514823240c2c2c67eee30949ea1b8) - @naseif
- [[Enhancement] made the skip message more beautiful](https://github.com/naseif/Eyesense-Music-Bot/commit/f17747cdfebd3f3409aa52df71b55aabc4628294) - @naseif
- [[Bug] Fixed shuffle command crashing because of undefined variable, added embed message to /nowplaying](https://github.com/naseif/Eyesense-Music-Bot/commit/6bc099b1bf59571bf9991594802f7829a96a9664) - @naseif

---

## 1.0.0 (26/08/2021)

- [error handling for the stop command](https://github.com/naseif/Eyesense-Music-Bot/commit/dd6656ec64074ac0fa8f635814a7a3c979103a1c) - @naseif
- [Initial commit](https://github.com/naseif/Eyesense-Music-Bot/commit/f3de5f79e08f191d11e6f2866d00df1ed0089a24) - @naseif
- [Initial commit](https://github.com/naseif/Eyesense-Music-Bot/commit/f7b70e2190721f87131ec64354b386bcefa2313c) - @naseif
