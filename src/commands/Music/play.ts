import { Args, Command, CommandOptions } from '@sapphire/framework';
import type { Message, MessageEmbedOptions } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { convertMStoHMS, embed } from '../../Utils/BotUtils';
import { client } from '../..';
import type { ITrack } from '../../types/Track';
import { SpotifyItemType } from '@lavaclient/spotify';

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
		} catch {}

		if (!searchQuery) return await message.channel.send({ embeds: [embed(`❌ You must provide a search query!`, { color: 'RED' })] });

		if (!message.guild || !message.guild.me || !message.member) return;

		if (!message.member.voice.channel)
			return await message.channel.send({ embeds: [embed('❌ You must be in a voice channel to play music!', { color: 'RED' })] });

		if (message.guild.me.voice.channelId && message.member.voice.channelId !== message.guild.me.voice.channelId)
			return await message.channel.send({ embeds: [embed('❌ You must be in my voice channel!', { color: 'RED' })] });

		const player =
			client.music.players.get(message.guild.id)?.connect(message.member.voice.channel, { deafened: true }) ??
			client.music.createPlayer(message.guild).connect(message.member.voice.channel, { deafened: true });

		let queue = client.queue ?? client.getQueue(player);

		let tracks: ITrack[] = [],
			msg: string = '';

		let musicEmbed: MessageEmbedOptions = {};

		let results;
		let item;
		if (client.music.spotify.isSpotifyUrl(searchQuery)) {
			item = await client.music.spotify.load(searchQuery);
			switch (item?.type) {
				case SpotifyItemType.Track:
					const track = await item.resolveYoutubeTrack();
					tracks = [track];
					queue.add(tracks, {
						requester: message.member
					});
					msg = `**[${track.info.author} - ${item.name}](${track.info.uri})** - \`${convertMStoHMS(track.info.length)}\``;
					break;
				case SpotifyItemType.Artist:
					tracks = await item.resolveYoutubeTracks();
					queue.add(tracks, {
						requester: message.member
					});
					msg = `Queued the **Top ${tracks.length} tracks** for [${item.name}](${searchQuery})`;
					break;
				case SpotifyItemType.Album:
				case SpotifyItemType.Playlist:
					tracks = await item.resolveYoutubeTracks();
					if (!tracks)
						return await message.channel.send({
							embeds: [embed(`❌ Could not fetch the requested songs, This could be caused by Youtube ratelimit!`, { color: 'RED' })]
						});
					let filtered = tracks.filter((track) => track?.track);

					queue.add(filtered, {
						requester: message.member
					});
					msg = `Queued **${tracks.length} tracks** from ${SpotifyItemType[item.type].toLowerCase()} [${item.name}](${searchQuery})`;
					break;
			}
		} else {
			results = await client.music.rest.loadTracks(/^https?:\/\//.test(searchQuery) ? searchQuery : `ytsearch:${searchQuery}`);
			switch (results.loadType) {
				case 'LOAD_FAILED':
				case 'NO_MATCHES':
					return await message.channel.send({ embeds: [embed(`❌ Could not fetch the requested song, Sorry :(`, { color: 'RED' })] });
				case 'PLAYLIST_LOADED':
					tracks = results.tracks;
					queue.add(tracks, {
						requester: message.member
					});
					msg = `Queued playlist [${results.playlistInfo.name}](${searchQuery}) with a total of **${tracks.length}** tracks.`;
					break;
				case 'TRACK_LOADED':
				case 'SEARCH_RESULT':
					tracks = results.tracks;
					const [song] = results.tracks;
					queue.add(song, { requester: message.member });
					msg = `**[${song.info.title}](${song.info.uri})** - \`${convertMStoHMS(song.info.length)}\``;
					break;
			}
		}

		if (!tracks.length)
			return await message.channel.send({ embeds: [embed(`❌ Could not fetch the requested song, Sorry :(`, { color: 'RED' })] });

		queue.set(message.channelId, message.channel);

		if (results && results.loadType === 'PLAYLIST_LOADED') {
			musicEmbed = {
				color: '#9dcc37',
				description: msg
			};
		} else if ((results && results?.loadType === 'TRACK_LOADED') || (results && results?.loadType === 'SEARCH_RESULT')) {
			musicEmbed = {
				color: '#9dcc37',
				title: `${player.playing ? '✅ Added to Queue' : '🎵  Playing'}`,
				description: msg
			};
		}

		if (!results && item) {
			musicEmbed = {
				color: '#9dcc37',
				title: `${player.playing ? '✅ Added to Queue' : '🎵  Playing'}`,
				description: msg
			};
		}

		await message.channel.send({ embeds: [musicEmbed] });

		const queuePlaying = player.playing || player.paused;

		if (!queuePlaying) {
			await queue.start();
		}

		return;
	}
}
