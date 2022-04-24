import { Args, Command, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { player } from '../..';
import { embed } from '../../Utils/BotUtils';
import { writeFileSync } from 'fs';

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

		if (!searchQuery) return await message.channel.send({ embeds: [embed('`You must provide a search query!`', { color: 'RED' })] });

		if (!message.guild || !message.guild.me || !message.member) return;

		if (!message.member.voice.channelId)
			return await message.channel.send({ embeds: [embed('You must be in a voice channel to play music!', { color: 'RED' })] });

		if (message.guild.me.voice.channelId && message.member.voice.channelId !== message.guild.me.voice.channelId)
			return await message.channel.send({ embeds: [embed('You must be in my voice channel!', { color: 'RED' })] });

		const queue = player.GetQueue(message.guild.id) ?? player.CreateQueue(message.guild.id);

		if (!queue) return;

		let msg = await message.channel.send({ embeds: [embed(`Searching for ${searchQuery}`)] });

		const searchSong = await queue.search(searchQuery, message.author);

		if (!searchSong || searchSong.tracks.length === 0) {
			return await msg.edit({ embeds: [embed('No songs found for your search query!', { color: 'RED' })] });
		}

		if (queue.playing) {
			if (searchSong.playlist) {
				writeFileSync('test.json', JSON.stringify(searchSong.tracks), 'utf8');
				await msg.edit({ embeds: [embed(`Found playlist!`)] });
				let urls = searchSong.tracks.map((track) => track.url);
				await queue.addTracks(urls, message.author);
				await msg.edit({ embeds: [embed(`${searchSong.tracks.length} Songs have been added to the Queue!`)] });
				writeFileSync('queue.json', JSON.stringify(queue.tracks), 'utf8');
				return;
			}

			await msg.edit({ embeds: [embed(`Song ${searchSong.tracks[0].title} Added to Queue!`)] });
			await queue.insert(searchSong.tracks[0].url, 1, message.author, {
				extractor: 'play-dl',
				metadata: {
					requestedBy: message.author
				},
				IgnoreError: false
			});
			return;
		}

		if (searchSong.playlist) {
			await msg.edit({ embeds: [embed(`Found playlist!`)] });
			let urls = searchSong.tracks.map((track) => track.url);
			await queue.addTracks(urls, message.author);
			await msg.edit({ embeds: [embed(`${searchSong.tracks.length} Songs have been added to the Queue!`)] });
		}

		await msg.edit({ embeds: [embed(`Found ${searchSong.tracks[0].title}`)] });

		// @ts-expect-error
		await queue.play(searchSong.tracks[0].url, message.member.voice.channel, message.author);
		await msg.edit({ embeds: [embed(`Playing ${searchSong.tracks[0].title}`)] });

		return;
	}
}
