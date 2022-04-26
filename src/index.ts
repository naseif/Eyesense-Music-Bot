import { LogLevel, SapphireClient } from '@sapphire/framework';
import { token } from './config.json';
import { DisTube } from 'distube';
import { SpotifyPlugin } from '@distube/spotify';
import { SoundCloudPlugin } from '@distube/soundcloud';
import { playerEvents } from './distubeEvents/events';

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

export const player = new DisTube(client, {
	leaveOnEmpty: true,
	leaveOnFinish: false,
	leaveOnStop: false,
	savePreviousSongs: true,
	searchSongs: 5,
	youtubeCookie:
		'CONSENT=YES+cb.20220123-17-p1.de+FX+060; VISITOR_INFO1_LIVE=oEpwUs2rphQ; PREF=tz=Europe.Berlin&f6=40000000&library_tab_browse_id=FEmusic_liked_playlists&volume=10; __Secure-1PSIDCC=AJi4QfF009IoMnuFBtip6XPl_4VbN4kH6k9bf8N2jW-hUPMGDhyax910kigOTV-3DmK6bnMX; SID=JAgFB1gR9RyaOny_typeBsV2JLSoxtwdJADoFx-ilWA_1LLzisx2Ta6ki2SEzbHpVkVDCQ.; __Secure-1PSID=JAgFB1gR9RyaOny_typeBsV2JLSoxtwdJADoFx-ilWA_1LLzgyhzGfd47EzBXIWgw9Nh9w.; __Secure-3PSID=JAgFB1gR9RyaOny_typeBsV2JLSoxtwdJADoFx-ilWA_1LLzxSQ_Hb4J70PumfAu5sK_Mw.; HSID=Al1yUou9rqvmJO7Nz; SSID=AHoYe0yZyQs8xdeLN; APISID=2L6tOyhVsenUYv06/A-Cl7GAouZt2Tt7Eo; SAPISID=rEr6EzTipbggOqV8/A1seTxGwYBTmdi6Jg; __Secure-1PAPISID=rEr6EzTipbggOqV8/A1seTxGwYBTmdi6Jg; __Secure-3PAPISID=rEr6EzTipbggOqV8/A1seTxGwYBTmdi6Jg; LOGIN_INFO=AFmmF2swRQIgJnJwANf4JMSZXWuvOWCHAQdZ6wqy7_tup38cLcxOrj4CIQCo9TW860jFn1oHp4xytrLpqNLxaGULaTn701QfbH0ATQ:QUQ3MjNmd2d3dV9hMmxmWWlsN3kwM3JMYmd2UFNabzdHU3BHamxYMGpzTk1FcXQ0OExKN1lhN014RVYwQmh2OWVNY3hiYjVTVU96WGJoTXlicnZhSEVpUW5VWjR5U0o1NnNESUZib2tzOTlRSFlnMmR1amR1WDZVYmtVR0lsVXU5OEVKdThzM2wyeUFzLXhoQUpjbUM2c19ZbmpVT1A1SC13; __Secure-3PSIDCC=AJi4QfGhc7CIMWxRByd7zgHmOyFerX-sW_1FSKRWvKd2o1KP0aHx7bKbCFG5a7V-8Bvpq2zZCQ; SIDCC=AJi4QfEjP2ERQ4DCY84arATc8yfqDDOYPWpRtBONxuwTbT2kiwGGh2wlqpcPyDbIu8s-kyq6cA; _gcl_au=1.1.1291657885.1645913130; YSC=Pwhn2j1kyrw; ST-1b=disableCache=true&itct=CCAQsV4iEwjRpeSV3633AhVFZOAKHYcJD9g%3D&csn=MC4xMjg4NjE0MjEzMTI4OTk0Ng..&endpoint=%7B%22clickTrackingParams%22%3A%22CCAQsV4iEwjRpeSV3633AhVFZOAKHYcJD9g%3D%22%2C%22commandMetadata%22%3A%7B%22webCommandMetadata%22%3A%7B%22url%22%3A%22%2F%22%2C%22webPageType%22%3A%22WEB_PAGE_TYPE_BROWSE%22%2C%22rootVe%22%3A3854%2C%22apiUrl%22%3A%22%2Fyoutubei%2Fv1%2Fbrowse%22%7D%7D%2C%22browseEndpoint%22%3A%7B%22browseId%22%3A%22FEwhat_to_watch%22%7D%7D',
	emptyCooldown: 60,
	nsfw: true,
	youtubeDL: false,
	plugins: [new SpotifyPlugin(), new SoundCloudPlugin()]
});

playerEvents(player);
client.login(token);
