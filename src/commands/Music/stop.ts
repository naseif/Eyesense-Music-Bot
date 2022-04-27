import { Command, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { client } from '../..';
import { embed } from '../../Utils/BotUtils';

@ApplyOptions<CommandOptions>({
	description: 'Stops the player and leaves the voice channel',
	aliases: ['st'],
	name: 'stop'
})
export class StopCommand extends Command {
	public async messageRun(message: Message) {
		if (!message?.guildId) return;

		if (!message.guild || !message.guild.me || !message.member) return;

		if (!message.member.voice.channel)
			return await message.channel.send({ embeds: [embed('You must be in a voice channel to stop music!', { color: 'RED' })] });

		if (message.guild.me.voice.channelId && message.member.voice.channelId !== message.guild.me.voice.channelId)
			return await message.channel.send({ embeds: [embed('You must be in my voice channel!', { color: 'RED' })] });

		const player = client.music.players.get(message?.guildId);

		if (!player?.connected) {
			return message.reply({
				embeds: [
					embed(`I could not find an active player for this guild, please make sure to play a song first before using this command!`, {
						color: 'RED'
					})
				]
			});
		}

		const queue = client.getQueue(player);

		if (player.playing || player.paused) {
			await player.stop();
			queue.clear();
			return player.disconnect();
		} else {
			return await message.channel.send({ embeds: [embed(`Nothing is playing to stop!`)] });
		}
	}
}
