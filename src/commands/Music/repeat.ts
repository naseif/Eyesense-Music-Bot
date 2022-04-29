import { SubCommandPluginCommand, SubCommandPluginCommandOptions } from '@sapphire/plugin-subcommands';
import type { Message } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { client } from '../..';
import { embed } from '../../Utils/BotUtils';
import type { LoopType } from '@lavaclient/queue';

@ApplyOptions<SubCommandPluginCommandOptions>({
	description: 'Loops the Queue or the current playing song!',
	aliases: ['loop'],
	name: 'repeat',
	subCommands: ['queue', 'off', { input: 'song', default: true }]
})
export class RepeatCommand extends SubCommandPluginCommand {
	async song(message: Message<boolean>) {
		await this.execute(message, 2);
		return;
	}

	public async queue(message: Message<boolean>) {
		await this.execute(message, 1);
		return;
	}

	public async off(message: Message<boolean>) {
		await this.execute(message, 0);
		return;
	}

	async execute(message: Message<boolean>, mode: LoopType) {
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

		switch (mode) {
			case 0:
				queue.setLoop(0);
				await message.channel.send({ embeds: [embed(`✅ Repeat Mode has been disabled!`)] });
				break;

			case 1:
				queue.setLoop(1);
				await message.channel.send({ embeds: [embed(`✅ Repeat Mode has been enabled for the current queue!`)] });
				break;

			case 2:
				queue.setLoop(2);
				await message.channel.send({ embeds: [embed(`✅ | Repeat Mode has been enabled for **${queue.current?.title}**`)] });
				break;
		}

		return;
	}
}
