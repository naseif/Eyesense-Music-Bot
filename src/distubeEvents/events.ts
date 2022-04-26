import type DisTube from 'distube';
import { embed } from '../Utils/BotUtils';

export function playerEvents(player: DisTube) {
	player.on('addList', async (queue, playlist) => {
		await queue?.textChannel?.send(`Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to the queue!`);
	});

	player.on('addSong', async (queue, song) => {
		if (queue.songs.length === 1) return;
		const musicEmbed = {
			title: `${queue.playing ? '✅ Added to Queue' : '🎵  Playing'}`,
			author: {
				name: `${song.member?.user.username}`,
				icon_url: `${song.member?.user.avatarURL()}`
			},
			thumbnail: {
				url: `${song.thumbnail}`
			},
			fields: [
				{
					name: 'Author',
					value: `${song.uploader.name}`,
					inline: true
				},
				{
					name: '🕓 Duration',
					value: `${song.formattedDuration}`,
					inline: true
				}
			],

			timestamp: new Date()
		};

		await queue.textChannel?.send({ embeds: [embed(`Song: **[${song.name}](${song.url})**`, musicEmbed)] });
	});

	player.on(
		'playSong',
		async (queue, song) => await queue.textChannel?.send(`Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}`)
	);
}
