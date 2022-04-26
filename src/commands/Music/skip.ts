import { Command, CommandOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';

@ApplyOptions<CommandOptions>({
	description: 'Skips the current playing song',
	aliases: ['s', 'sk'],
	name: 'skip'
})
export class SkipCommand extends Command {
	public async messageRun(message: Message) {
		await message.channel.send("skip")
		return;
	}
}
