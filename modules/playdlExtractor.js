const playdl = require("play-dl");

module.exports = {
  version: "1.0.0",
  getInfo(query) {
    return new Promise(async (resolve, reject) => {
      if (!query || typeof query !== "string") reject(new Error("Invalid url"));

      const playlistRegex = {
        YouTubePlaylist:
          /^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com)).*(youtu.be\/|list=)([^#&?]*).*/,
        YouTubePlaylistID: /[&?]list=([^&]+)/,
      };

      if (
        playlistRegex.YouTubePlaylist.test(query) ||
        playlistRegex.YouTubePlaylistID.test(query)
      ) {
        const playlist = await playdl.playlist_info(query);
        await playlist.fetch();
        const data = playlist.videos.map((track) => {
          return {
            title: track.title,
            duration: track.durationInSec * 1000,
            thumbnail: track.thumbnail.url || "",
            async engine() {
              return await playdl.stream(track.url);
            },
            views: track.views || "",
            author: track.channel.name || "",
            description: track.description || "",
            url: track.url,
            playlist: true,
            source: "youtube",
          };
        });
        return resolve({ playlist: true, info: [data] });
      }

      const vidInfo = await playdl.video_info(query);
      try {
        const data = {
          title: vidInfo.video_details.title,
          duration: vidInfo.video_details.durationInSec * 1000,
          thumbnail: vidInfo.video_details.thumbnail.url || "",
          async engine() {
            return await playdl.stream(vidInfo.video_details.url);
          },
          views: vidInfo.video_details.views || "",
          author: vidInfo.video_details.channel.name || "",
          description: vidInfo.video_details.description || "",
          url: vidInfo.video_details.url,
          playlist: undefined,
          source: "youtube",
        };
        resolve({ playlist: null, info: [data] });
      } catch {
        resolve(null);
      }
    });
  },

  validate(url) {
    const REGEX =
      /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    return REGEX.test(url || "");
  },

  important() {
    return true;
  },
};
