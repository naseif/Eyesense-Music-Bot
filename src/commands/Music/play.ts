import { Args, Command, CommandOptions } from '@sapphire/framework';
import type { Message, MessageEmbedOptions } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { convertMStoHMS, embed } from '../../Utils/BotUtils';
import { client } from '../..';
import type { ITrack } from '../../types/Track';

@ApplyOptions<CommandOptions>({
	description: 'Plays music from Youtube, Spotify and Soundcloud!',
	aliases: ['p'],
	name: 'play',
	detailedDescription: 'p <YouTube URL | Song Name | Spotify URL | Soundcloud URL |>'
})
export class PlayCommand extends Command {
	public async messageRun(message: Message, args: Args) {
		let searchQuery: string = '';

		try {
			searchQuery = await args.rest('string', { minimum: 1 });
		} catch { }

		if (!searchQuery) return await message.channel.send({ embeds: [embed('`You must provide a search query!`', { color: 'RED' })] });

		if (!message.guild || !message.guild.me || !message.member) return;

		if (!message.member.voice.channel)
			return await message.channel.send({ embeds: [embed('You must be in a voice channel to play music!', { color: 'RED' })] });

		if (message.guild.me.voice.channelId && message.member.voice.channelId !== message.guild.me.voice.channelId)
			return await message.channel.send({ embeds: [embed('You must be in my voice channel!', { color: 'RED' })] });

		let player =
			client.music.players.get(message.guild.id)?.connect(message.member.voice.channel) ??
			client.music.createPlayer(message.guild).connect(message.member.voice.channel);

		let queue = client.getQueue(player)
		const results = await client.music.rest.loadTracks(/^https?:\/\//.test(searchQuery) ? searchQuery : `ytsearch:${searchQuery}`);

		let tracks: ITrack[] = [];

		const musicEmbed: MessageEmbedOptions = {
			color: '#9dcc37',
			title: `${player.playing ? '✅ Added to Queue' : '🎵  Playing'}`,
			author: {
				name: `${message.member.user.username}`,
				icon_url: `${message.member.user.avatarURL()}`
			},
			description: `Song: **[${results.tracks[0].info.title}](${results.tracks[0].info.uri})**`,
			fields: [
				{
					name: 'Author',
					value: `${results.tracks[0].info.author}`,
					inline: true
				},
				{
					name: '🕓 Duration',
					value: `${convertMStoHMS(results.tracks[0].info.length)}`,
					inline: true
				}
			],

			timestamp: new Date()
		};

		queue.set('channel', message.channel);

		if (player.playing) {
			if (results.loadType === 'LOAD_FAILED' || results.loadType === 'NO_MATCHES') {
				return await message.channel.send({ embeds: [embed(`Could not fetch the requested song, Sorry :(`, { color: 'RED' })] });
			}

			if (results.loadType === 'PLAYLIST_LOADED') {
				tracks = results.tracks;
				queue.add(tracks, {
					requester: message.member
				});

				return await message.channel.send({
					embeds: [embed(`Queued playlist ${results.playlistInfo.name} - ${results.tracks.length} Songs`)]
				});
			}

			if (results.loadType === 'SEARCH_RESULT' || results.loadType === 'TRACK_LOADED') {
				const [song] = results.tracks;
				queue.add(song, { requester: message.member });
				return await message.channel.send({ embeds: [musicEmbed] });
			}
		}

		if (results.loadType === 'LOAD_FAILED' || results.loadType === 'NO_MATCHES') {
			return await message.channel.send({ embeds: [embed(`Could not fetch the requested song, Sorry :(`, { color: 'RED' })] });
		}

		if (results.loadType === 'PLAYLIST_LOADED') {
			tracks = results.tracks;
			queue.add(tracks, {
				requester: message.member
			});
			await queue.start();
			return await message.channel.send({ embeds: [embed(`Added playlist ${results.playlistInfo.name} - ${results.tracks.length} Songs`)] });
		}

		if (results.loadType === 'SEARCH_RESULT' || results.loadType === 'TRACK_LOADED') {
			const [song] = results.tracks;
			queue.add(song, { requester: message.member });
			await queue.start();
			return await message.channel.send({ embeds: [musicEmbed] });
		}

		return;
	}
}
