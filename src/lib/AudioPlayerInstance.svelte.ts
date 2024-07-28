import { AudioPlayerManager } from './audioPlayerManager.svelte.js';
import { type IAudioPlayer, type PlayerOptions, createAudioPlayer } from './createAudioPlayer.js';

export interface IAudioPlayerInstance {
	isPlaying: boolean;
	progress: number;
	player: IAudioPlayer;
	exclusive: boolean;
	togglePlayPause: () => void;
	pause: () => void;
	stop: () => void;
	setVolume: (volume: number) => void;
	destroy: () => void;
}

export class AudioPlayerInstance implements IAudioPlayerInstance {
	isPlaying = $state(false);
	progress = $state(0);
	player: IAudioPlayer;
	exclusive: boolean;

	constructor(
		container: HTMLElement,
		options: PlayerOptions,
		implementation: (
			container: HTMLElement,
			options: PlayerOptions
		) => IAudioPlayer = createAudioPlayer
	) {
		this.exclusive = options.exclusive || false;
		this.player = implementation(container, options);

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

		$effect(() => {
			this.progress = this.player.getCurrentTime() / this.player.getDuration() || 0;
		});
	}

	togglePlayPause() {
		if (this.exclusive) {
			AudioPlayerManager.players.forEach((player) => {
				if (player !== this) {
					player.pause();
				}
			});
		}
		this.isPlaying = !this.isPlaying;
		this.player.togglePlayPause();
	}

	pause() {
		this.player.pause();
		this.isPlaying = false;
	}

	stop() {
		this.player.stop();
		this.isPlaying = false;
		this.progress = 0;
	}

	setVolume(volume: number) {
		this.player.setVolume(volume);
	}

	destroy() {
		this.player.destroy();
	}

	get isPlayingState() {
		return this.isPlaying;
	}

	get progressState() {
		return this.progress;
	}
}
