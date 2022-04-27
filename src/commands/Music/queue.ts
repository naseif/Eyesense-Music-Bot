import { Command, CommandOptions } from '@sapphire/framework';
import { Message, MessageEmbed } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { client } from '../..';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import * as _ from 'lodash';
import { embed } from '../../Utils/BotUtils';

@ApplyOptions<CommandOptions>({
    description: 'Shows all queued songs',
    name: 'queue'
})
export class QueueCommand extends Command {
    async messageRun(message: Message) {
        if (!message?.guildId) return;

        if (!message.guild || !message.guild.me || !message.member) return;

        if (!message.member.voice.channel)
            return await message.channel.send({ embeds: [embed('You must be in a voice channel to use this command!', { color: 'RED' })] });

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

        let queue = client.getQueue(player);

        if (!queue || !queue.tracks.length) {
            return await message.channel.send({
                embeds: [embed(`❌ | Nothing to list, Queue is empty`, { color: 'RED' })]
            });
        }

        let tracks = queue?.tracks?.map((track, index) => `[${index + 1}] • [${track.title}](${track.uri}) • <@${track.requester}>`);

        let chunked = _.chunk(tracks, 30);
        const pages = chunked.map((s) => s.join('\n'));

        const paginatedMessage = new PaginatedMessage({
            template: new MessageEmbed()
                .setColor('#9dcc37')
                .setFooter({ text: `Playing now: ${queue.current?.title ? queue.current?.title : 'Nothing'}` })
        });

        for (let page of pages) {
            paginatedMessage.addPageEmbed((embed) => embed.setDescription(page).setTitle(`${message.guild?.name}'s Queue`));
        }
        return await paginatedMessage.run(message, message.author);
    }
}
