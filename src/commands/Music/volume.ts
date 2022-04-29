import { Args, Command, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { client } from '../..';
import { embed } from '../../Utils/BotUtils';

@ApplyOptions<CommandOptions>({
	description: 'Change the bots volume',
	aliases: ['v', 'vol'],
	name: 'volume'
})
export class VolumeCommand extends Command {
	public async messageRun(message: Message, args: Args) {
		if (!message?.guildId) return;

		if (!message.guild || !message.guild.me || !message.member) return;

		if (!message.member.voice.channel)
			return await message.channel.send({ embeds: [embed('❌ You must be in a voice channel to play music!', { color: 'RED' })] });

		if (message.guild.me.voice.channelId && message.member.voice.channelId !== message.guild.me.voice.channelId)
			return await message.channel.send({ embeds: [embed('❌ You must be in my voice channel!', { color: 'RED' })] });

		let newVol: number = 0;

		try {
			newVol = await args.pick('number');
		} catch {}

		if (!newVol)
			return await message.channel.send({
				embeds: [embed(`❌ You should provide me with the new desired volume, this can be up to 200!`, { color: 'RED' })]
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

		if (player.playing || player.paused) {
			await player.setVolume(newVol);
			await message.channel.send({ embeds: [embed(`✅ Set Bot Volume to **${newVol}**`)] });
			return;
		} else {
			return await message.channel.send({ embeds: [embed(`❌ Could not set volume!`)] });
		}
	}
}
