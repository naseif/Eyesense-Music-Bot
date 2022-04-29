import { Args, Command, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { client } from '../..';
import { embed } from '../../Utils/BotUtils';

@ApplyOptions<CommandOptions>({
	description: 'Seeks the current playing song to the given time',
	name: 'seek'
})
export class SeekCommand extends Command {
	async messageRun(message: Message, args: Args) {
		if (!message?.guildId) return;

		if (!message.guild || !message.guild.me || !message.member) return;

		if (!message.member.voice.channel)
			return await message.channel.send({ embeds: [embed('❌ You must be in a voice channel to use this command!', { color: 'RED' })] });

		if (message.guild.me.voice.channelId && message.member.voice.channelId !== message.guild.me.voice.channelId)
			return await message.channel.send({ embeds: [embed('❌ You must be in my voice channel!', { color: 'RED' })] });

		let newstartTime: number = 0;

		try {
			newstartTime = await args.pick('number');
		} catch {}

		if (!newstartTime)
			return await message.channel.send({
				embeds: [embed(`❌ You should provide me with the new desired start time!`, { color: 'RED' })]
			});

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

		try {
			if (player.playing) {
				await player.seek(newstartTime * 1000);
				player.filters.karaoke?.level.toExponential(10);
				return await message.channel.send({ embeds: [embed(`✅ **${player.trackData?.title}** seeked ${newstartTime} seconds!`)] });
			} else {
				return await message.channel.send({ embeds: [embed(`❌ There is nothing playing to seek!`, { color: 'RED' })] });
			}
		} catch (error) {}

		return;
	}
}
