import { setContext, getContext } from 'svelte';
import { AudioPlayerInstance } from './AudioPlayerInstance.svelte.js';
import { type PlayerOptions } from './createAudioPlayer.js';

let globalIsPlaying = $state(false);
let globalPlayPause = $state<(() => void)[]>([]);

export class AudioPlayerManager {
	static players: AudioPlayerInstance[] = [];

	static setGlobalIsPlaying(isPlaying: boolean) {
		globalIsPlaying = isPlaying;
	}

	static getGlobalIsPlaying() {
		return globalIsPlaying;
	}

	static addGlobalPlayPause(callback: () => void) {
		globalPlayPause = [...globalPlayPause, callback];
	}

	static removeGlobalPlayPause(callback: () => void) {
		globalPlayPause = globalPlayPause.filter((fn) => fn !== callback);
	}

	static getGlobalPlayPause() {
		return globalPlayPause;
	}

	static registerPlayer(player: AudioPlayerInstance) {
		this.players.push(player);
	}

	static unregisterPlayer(player: AudioPlayerInstance) {
		this.players = this.players.filter((p) => p !== player);
	}
}

const AUDIO_PLAYER_KEY = Symbol('AUDIO_PLAYER');

type SetAudioPlayer = {
	container: HTMLElement;
	options: PlayerOptions;
};

export function setAudioPlayer({ container, options }: SetAudioPlayer) {
	const player = new AudioPlayerInstance(container, options);
	AudioPlayerManager.registerPlayer(player);
	return setContext(AUDIO_PLAYER_KEY, player);
}

export function getAudioPlayer() {
	return getContext<AudioPlayerInstance>(AUDIO_PLAYER_KEY);
}
