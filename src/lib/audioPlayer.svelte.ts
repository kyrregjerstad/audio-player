import { getContext, setContext, onDestroy } from 'svelte';
import { type IAudioPlayer, type PlayerOptions, createAudioPlayer } from './CreateAudioPlayer.js';

let globalIsPlaying = $state(false);
let globalPlayPause = $state<(() => void)[]>([]);

export class AudioPlayerManager {
	isPlaying = $state(false);
	progress = $state(0);
	player: IAudioPlayer;
	exclusive: boolean;

	constructor(
		container: HTMLElement,
		src: string,
		options: PlayerOptions,
		exclusive: boolean,
		implementation: (
			container: HTMLElement,
			src: string,
			options: PlayerOptions
		) => IAudioPlayer = createAudioPlayer
	) {
		this.exclusive = exclusive;
		this.player = implementation(container, src, options);

		this.player.onAudioProcess(() => {
			this.progress = this.player.getCurrentTime() / this.player.getDuration();
		});

		this.player.onFinish(() => {
			this.isPlaying = false;
			this.progress = 1;
			if (this.exclusive) {
				AudioPlayerManager.setGlobalIsPlaying(false);
			}
		});

		onDestroy(() => {
			this.player.destroy();
		});
	}

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

	playPause() {
		this.isPlaying = !this.isPlaying;
		if (this.isPlaying) {
			if (this.exclusive && AudioPlayerManager.getGlobalIsPlaying() && !this.isPlaying) {
				AudioPlayerManager.getGlobalPlayPause().forEach((fn) => fn());
			}
			this.player.playPause();
			if (this.exclusive) {
				AudioPlayerManager.addGlobalPlayPause(this.pause.bind(this));
				AudioPlayerManager.setGlobalIsPlaying(true);
			}
		} else {
			this.pause();
		}
	}

	pause() {
		this.player.pause();
		this.isPlaying = false;
		AudioPlayerManager.removeGlobalPlayPause(this.pause.bind(this));
		if (AudioPlayerManager.getGlobalPlayPause().length === 0) {
			AudioPlayerManager.setGlobalIsPlaying(false);
		}
	}

	stop() {
		this.player.stop();
		this.isPlaying = false;
		this.progress = 0;
		AudioPlayerManager.removeGlobalPlayPause(this.stop.bind(this));
		if (AudioPlayerManager.getGlobalPlayPause().length === 0) {
			AudioPlayerManager.setGlobalIsPlaying(false);
		}
	}

	setVolume(volume: number) {
		this.player.setVolume(volume);
	}

	get isPlayingState() {
		return this.isPlaying;
	}

	get progressState() {
		return this.progress;
	}
}

const AUDIO_PLAYER_KEY = Symbol('AUDIO_PLAYER');

export function setAudioPlayer(
	container: HTMLElement,
	src: string,
	options: PlayerOptions,
	exclusive: boolean
) {
	return setContext(AUDIO_PLAYER_KEY, new AudioPlayerManager(container, src, options, exclusive));
}

export function getAudioPlayer() {
	return getContext<AudioPlayerManager>(AUDIO_PLAYER_KEY);
}
