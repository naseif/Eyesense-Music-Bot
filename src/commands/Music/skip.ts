import { Command, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { player } from '../..';
import { embed } from '../../Utils/BotUtils';

@ApplyOptions<CommandOptions>({
	description: 'Skips the current playing song',
	aliases: ['s', 'sk'],
	name: 'skip'
})
export class SkipCommand extends Command {
	public async messageRun(message: Message) {
		const queue = player.getQueue(message);

		if (!queue) {
			return await message.channel.send({ embeds: [embed(`There is nothing playing to skip!`)] });
		}

		try {
			await queue.skip();
		} catch (error) {
			return await message.channel.send({ embeds: [embed(`There is no next song in the queue to skip!`, { color: 'RED' })] });
		}
		return;
	}
}
