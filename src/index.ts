import { token } from './config.json';
import { Bot } from './Utils/Bot';
import { load } from '@lavaclient/spotify';
import { spotify_clientid, spotify_client_secret } from './config.json';

load({
	client: {
		id: spotify_clientid,
		secret: spotify_client_secret
	},
	autoResolveYoutubeTracks: true
});

export const client = new Bot();

client.music.on('connect', () => {
	console.log(`connected to lavalink`);
});

client.music.on('error', (err) => console.log(err.message));

client.login(token);
