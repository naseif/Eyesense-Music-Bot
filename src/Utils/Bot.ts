import { LogLevel, SapphireClient } from '@sapphire/framework';
import { Node } from 'lavaclient';
import { lavalink_port, lavalink_host, lavalink_password, prefix } from './../config.json';
import '@lavaclient/queue';

export class Bot extends SapphireClient {
	readonly music: Node;

	constructor() {
		super({
			defaultPrefix: prefix,
			regexPrefix: /^(hey +)?bot[,! ]/i,
			caseInsensitiveCommands: true,
			logger: {
				level: LogLevel.Debug
			},
			shards: 'auto',
			intents: [
				'GUILDS',
				'GUILD_MEMBERS',
				'GUILD_BANS',
				'GUILD_EMOJIS_AND_STICKERS',
				'GUILD_VOICE_STATES',
				'GUILD_MESSAGES',
				'GUILD_MESSAGE_REACTIONS',
				'DIRECT_MESSAGES',
				'DIRECT_MESSAGE_REACTIONS'
			]
		});

		this.music = new Node({
			sendGatewayPayload: (id, payload) => this.guilds.cache.get(id)?.shard?.send(payload),
			connection: {
				host: lavalink_host,
				password: lavalink_password,
				port: Number(lavalink_port)
			}
		});

		this.ws.on('VOICE_SERVER_UPDATE', (data) => this.music.handleVoiceUpdate(data));
		this.ws.on('VOICE_STATE_UPDATE', (data) => this.music.handleVoiceUpdate(data));
	}
}
