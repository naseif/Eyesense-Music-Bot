export interface ITrack {
	track: string;
	info: {
		identifier: string;
		isSeekable: boolean;
		author: string;
		length: number;
		isStream: boolean;
		position: number;
		sourceName: string;
		title: string;
		uri: string;
	};
}
