import type { MessageEmbedOptions } from 'discord.js';

export function embed(description: string, options?: MessageEmbedOptions) {
	const embed = {
		description: description,
		color: options?.color || '#9dcc37',
		...options
	};

	return embed;
}

export function test(regex: RegExp, string: string) {
	return regex.test(string);
}

export const StreamersRegexList = {
	YOUTUBE:
		/^((?:https?:)\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))((?!channel)(?!user)\/(?:[\w\-]+\?v=|embed\/|v\/)?)((?!channel)(?!user)[\w\-]+)(((.*(\?|\&)t=(\d+))(\D?|\S+?))|\D?|\S+?)$/,
	SPOTIFY: /^((https:)?\/\/)?open.spotify.com\/(track|album|playlist)\//,
	SOUNDCLOUD: /^(?:(https?):\/\/)?(?:(?:www|m)\.)?(api\.soundcloud\.com|soundcloud\.com|snd\.sc)\/(.*)$/,
	YTPLAYLIST: /^.*(youtu.be\/|list=)([^#\&\?]*).*/
};


export function convertMStoHMS(durationMS: number) {
	if (!durationMS) return;

	const date = new Date(Date.UTC(0, 0, 0, 0, 0, 0, durationMS)),
		parts = [
			date.getUTCHours(),
			date.getUTCMinutes(),
			date.getUTCSeconds(),
		],
		formatted = parts.map((s) => String(s).padStart(2, "0")).join(":");

	return formatted
}