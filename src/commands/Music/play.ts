import { Args, Command, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { player } from '../..';
import { embed } from '../../Utils/BotUtils';

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

		if (!message.member.voice.channel)
			return await message.channel.send({ embeds: [embed('You must be in a voice channel to play music!', { color: 'RED' })] });

		if (message.guild.me.voice.channelId && message.member.voice.channelId !== message.guild.me.voice.channelId)
			return await message.channel.send({ embeds: [embed('You must be in my voice channel!', { color: 'RED' })] });

		//@ts-expect-error
		player.play(message.member?.voice?.channel, searchQuery, { member: message.member, message, textChannel: message.channel });

		return;
	}
}
