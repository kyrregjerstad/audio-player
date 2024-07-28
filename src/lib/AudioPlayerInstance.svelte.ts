import { AudioPlayerManager } from './audioPlayerManager.svelte.js';
import { type IAudioPlayer, type PlayerOptions, createAudioPlayer } from './CreateAudioPlayer.js';

export class AudioPlayerInstance {
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

		$effect(() => {
			this.progress = this.player.getCurrentTime() / this.player.getDuration();
		});
	}

	playPause() {
		if (this.exclusive) {
			AudioPlayerManager.players.forEach((player) => {
				if (player !== this) {
					player.pause();
				}
			});
		}
		this.isPlaying = !this.isPlaying;
		this.player.playPause();
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

	get isPlayingState() {
		return this.isPlaying;
	}

	get progressState() {
		return this.progress;
	}
}
