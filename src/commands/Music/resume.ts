import { Command, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { client } from '../..';
import { embed } from '../../Utils/BotUtils';

@ApplyOptions<CommandOptions>({
	description: 'Resumes a paused song',
	aliases: ['r'],
	name: 'resume'
})
export class ResumeCommand extends Command {
	async messageRun(message: Message<boolean>) {
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

		if (player.paused) {
			await player.resume();
			return await message.channel.send({ embeds: [embed(`✅ Resumed \`${player.trackData?.title}\``)] });
		} else {
			return await message.channel.send({ embeds: [embed(`❌ Nothing is paused to resume!`, { color: 'RED' })] });
		}
	}
}
