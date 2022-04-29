import { Command, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { client } from '../..';
import { embed } from '../../Utils/BotUtils';

@ApplyOptions<CommandOptions>({
	description: 'Pauses the current playing song!',
	name: 'pause'
})
export class PauseCommand extends Command {
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

		if (player && player.paused) {
			return await message.channel.send({ embeds: [embed(`❌ \`${player.trackData?.title}\` is already paused!`, { color: 'RED' })] });
		}

		if (player && player.playing) {
			await player.pause();
			return await message.channel.send({ embeds: [embed(`✅ Paused \`${player.trackData?.title}\``)] });
		} else {
			return await message.channel.send({ embeds: [embed(`❌ There is nothing playing to pasue!`, { color: 'RED' })] });
		}
	}
}
