import { getContext, setContext } from 'svelte';
import type { PlayerOptions } from './createAudioPlayer.js';
import { createAudioPlayer, type IAudioPlayer } from './createAudioPlayer.js';

export class AudioPlayerState {
	private player: IAudioPlayer;
	private node: HTMLElement;
	isPlaying = $state(false);
	progress = $state(0);
	volume = $state(1);
	duration = $state(0);
	currentTime = $state(0);

	constructor(node: HTMLElement, options: PlayerOptions) {
		this.node = node;
		this.player = createAudioPlayer(node, options);
		this.setupEventHandlers();
	}

	private setupEventHandlers() {
		// Setup player event handlers
		this.player.onAudioProcess(() => {
			this.currentTime = this.player.getCurrentTime();
			this.duration = this.player.getDuration();
			this.progress = this.currentTime / this.duration;
		});

		this.player.onFinish(() => {
			this.isPlaying = false;
			this.progress = 1;
			this.currentTime = this.duration;
		});
	}

	update(newOptions: PlayerOptions, oldOptions: PlayerOptions) {
		if (newOptions.src !== oldOptions.src) {
			this.destroy();
			return new AudioPlayerState(this.node, newOptions);
		}
	}

	destroy() {
		this.player.destroy();
	}

	togglePlayPause() {
		this.player.togglePlayPause();
		this.isPlaying = !this.isPlaying;
	}

	play() {
		if (!this.isPlaying) {
			this.togglePlayPause();
		}
	}

	pause() {
		if (this.isPlaying) {
			this.player.pause();
			this.isPlaying = false;
		}
	}

	stop() {
		this.player.stop();
		this.isPlaying = false;
		this.progress = 0;
		this.currentTime = 0;
	}

	setVolume(value: number) {
		this.volume = Math.max(0, Math.min(1, value));
	}
}

const AUDIO_PLAYER_KEY = Symbol('AUDIO_PLAYER');

type SetAudioPlayer = {
	node: HTMLElement;
	options: PlayerOptions;
};

export function setAudioPlayer({ node, options }: SetAudioPlayer) {
	return setContext(AUDIO_PLAYER_KEY, new AudioPlayerState(node, options));
}

export function getAudioPlayer() {
	return getContext<AudioPlayerState>(AUDIO_PLAYER_KEY);
}
