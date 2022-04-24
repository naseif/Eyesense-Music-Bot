import { LogLevel, SapphireClient } from '@sapphire/framework';
import { Player } from 'jericho-player';
import { token } from './config.json';

const client = new SapphireClient({
    defaultPrefix: '!',
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

export const player = new Player(client, {
    LeaveOnEmpty: true,
    LeaveOnEnd: false,
    extractor: "youtube-dl",
    LeaveOnBotOnly: true,
    LeaveOnBotOnlyTimedout: 1000,
    LeaveOnEndTimedout: 1000,
    NoMemoryLeakMode: true,
    IgnoreError: false,
    readonlyLeaveOnEmptyTimedout: 1000,
    ExtractorStreamOptions: {
        UserAgents: ["Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36 Edg/97.0.1072.62"],
        Quality: "high",
        Proxy: "",
        Cookies: "",
        Limit: 5,
        ByPassYoutubeDLRatelimit: true,
        YoutubeDLCookiesFilePath: "",
    }
});

client.login(token);
