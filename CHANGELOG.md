# Changelog

## 4.0.0 (28/08/2021)
- 6fab157d06bc776d0390a39d9ddd83caf882fded: [New] Added an option to search for lyrics instead of searching only for the current song. Also added an if statment to check if there are parentheses in the current.title and slicing if found to improve automatic lyric search | (@naseif)
- fe51cb1a7360d40c54d597bef3e7baebacdb4993: [Enhancement] Deleted stop command since it destroys the queue, pause and resume are are a good replacement | (@naseif)
- 76c272970c4525d72c56fa2df407106635754165: [Fix] Fixed embed message not sending messages | (@naseif)
- 168ecb6c3cfb7863fc072416b115e986569d00f6: [Enhancement] Added another embed message for the play command (Ups!) | (@naseif)
- 303c4dae2d6e7acda745b25b8b78d60a6ef9cac5: [Fix] Removed github link from author embed property | (@naseif)
- e570aa8b45a8fc64e18f8cbd2ee1d2d2e69ff648: [Enhancement] Added embe messages for possible errors from play command | (@naseif)
- c428af42bad9ec8d263c6d218465db137cf68d61: [New] Added lyrics command which gets the lyrics for the current playing song | (@naseif)
- dff5e59c8995c9b61812af4516941835b3b710d4: [Enhancement] Added ytdl options for much faster audio playback | (@naseif)

---

## 3.0.0 (28/08/2021)
- a5a1797eb772f935f1710dfc3ab2dbbd7ff9f85e: [New] Added 8ball command ;) | (@naseif)
- 4abcc66d14664041a4a09afc53e51ef23f8dd1d9: [New] Added removerole command (only works for users with ADMINSTRAITOR flag!) | (@naseif)
- 38fea596129915bcab6fee57ef1546fa50505348: [New] addrole command adde (Works only with users who have ADMINISTRATOR flag!) | (@naseif)
- 9aa41be0392f8fe38061e5552dfa4270ebde8f98: deprecated opusscript and replaced it with @discordjs/opus for better performance,, added zlib-sync for much faster websocket connections | (@naseif)
- 501e6f0703ec5d26a6295c2af1f3ddc1285f42bc: [New] Added guildCreate event which triggers commands registering when the bot joins a new server | (@naseif)
- 5cd20c8163fd9bbf08de194eb3438eb1428b3ee9: [Debugging] Seek command not working as excepted | (@naseif)
- d16d5b200467e2518c3c35e0e15167c04f45c6d0: [New] Added get user Avatar command | (@naseif)
- 1215fe46580dd184316d5add742a25dbe85b6578: [New] Added deleteMessages command | (@naseif)
- 1526725297c2343d0dddbf6233804d13b34b2bea: [New] Added kick member command | (@naseif)
- eedcb010286acd2e0e451b977268522aac0c0eb5: [New] Added ban user command | (@naseif)
- 90b3ee3af8ce880c0adc9dc34443d8221792001b: [New] Added ping command! | (@naseif)
- e303924d9a4baf130bc41284bdda40f46498e45c: [New] Added new funny commands | (@naseif)

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
