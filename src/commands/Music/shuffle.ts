import { Command, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { client } from '../..';
import { embed } from '../../Utils/BotUtils';

@ApplyOptions<CommandOptions>({
	description: 'Shuffles the songs queue for this guild',
	name: 'shuffle'
})
export class ShuffleCommand extends Command {
	public async messageRun(message: Message) {
		if (!message?.guildId) return;

		if (!message.guild || !message.guild.me || !message.member) return;

		if (!message.member.voice.channel)
			return await message.channel.send({ embeds: [embed('❌ You must be in a voice channel to use my commands!', { color: 'RED' })] });

		if (message.guild.me.voice.channelId && message.member.voice.channelId !== message.guild.me.voice.channelId)
			return await message.channel.send({ embeds: [embed('❌ You must be in my voice channel!', { color: 'RED' })] });

		const player = client.music.players.get(message?.guildId);

		if (!player?.connected) {
			return message.reply({
				embeds: [
					embed(`❌ I could not find an active player for this guild, please make sure to play a song first before using this command!`, {
						color: 'RED'
					})
				]
			});
		}

		let queue = client.queue ?? client.getQueue(player);

		if (!queue || !queue.tracks.length)
			return await message.channel.send({ embeds: [embed(`❌ | There is no queue to shuffle!`, { color: 'RED' })] });

		if (queue && queue.tracks.length >= 1) {
			try {
				queue.shuffle();
				return await message.channel.send({ embeds: [embed(`✅ Queue has been shuffled [${message.member.toString()}]`)] });
			} catch (error) {
				return await message.channel.send({ embeds: [embed(`❌ Could not shuffle the queue`, { color: 'RED' })] });
			}
		}

		return;
	}
}
