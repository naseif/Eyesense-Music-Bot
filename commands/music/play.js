const { SlashCommandBuilder, time } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("plays music from Youtube")
    .addStringOption((option) =>
      option.setName("song").setDescription("song name").setRequired(true)
    ),
  async execute(interaction, client) {
    await interaction.deferReply();

    if (!interaction.member.voice.channelId)
      return await interaction.followUp(
        "You must be in a Voice Channel to play music!"
      );

    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId !==
        interaction.guild.me.voice.channelId
    )
      return await interaction.followUp("You must be in my voice channel!");

    const guild = client.guilds.cache.get(interaction.guildId);
    const channel = guild.channels.cache.get(interaction.channelId);

    const songString = interaction.options.getString("song");

    const searchSong = await client.player.search(songString, {
      requestedBy: interaction.user,
    });

    if (!searchSong.tracks.length || !searchSong)
      return interaction.followUp("No Songs were found");

    const queue = client.player.createQueue(guild, {
      leaveOnEnd: false,
      leaveOnStop: false,
      initialVolume: 50,
    });

    try {
      if (!queue.connection)
        await queue.connect(interaction.member.voice.channel);
    } catch {
      client.player.deleteQueue(interaction.guildId);
      queue.destroy();
      return await interaction.followUp({
        content: "Could not join your voice channel!",
        empheral: true,
      });
    }

    searchSong.playlist
      ? queue.addTracks(searchSong.tracks)
      : queue.addTrack(searchSong.tracks[0]);

    const musicEmbed = {
      color: "#9dcc37",
      title: `${queue.playing ? "✅ Added to Queue" : "🎵  Playing"}`,
      author: {
        name: `${interaction.user.username}`,
        icon_url: `${interaction.user.avatarURL()}`,
        url: "https://github.com/naseif/",
      },
      description: `Song: **${searchSong.tracks[0].title}**`,
      thumbnail: {
        url: `${searchSong.tracks[0].thumbnail}`,
      },
      fields: [
        {
          name: "Author",
          value: `${searchSong.tracks[0].author}`,
          inline: true,
        },
        {
          name: "🕓 Duration",
          value: `${searchSong.tracks[0].duration}`,
          inline: true,
        },
      ],

      timestamp: new Date(),
      footer: {
        text: "Created by naseif",
        icon_url: "https://i.imgur.com/yeuStLw.png",
      },
    };

    if (!queue.playing) {
      await interaction.followUp({ embeds: [musicEmbed] });
      await queue.play();
    }

    if (queue.playing) {
      await interaction.followUp({ embeds: [musicEmbed] });
    }
  },
};
