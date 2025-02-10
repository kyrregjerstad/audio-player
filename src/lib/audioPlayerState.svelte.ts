import { type IAudioPlayer, type PlayerOptions, createAudioPlayer } from './createAudioPlayer.js';

export class AudioPlayerState {
	private player: IAudioPlayer;
	isPlaying = $state(false);
	progress = $state(0);
	volume = $state(1);

	constructor(
		container: HTMLElement,
		options: PlayerOptions,
		implementation: (container: HTMLElement, options: PlayerOptions) => IAudioPlayer = createAudioPlayer
	) {
		this.player = implementation(container, options);

		// Setup player event handlers
		this.player.onAudioProcess(() => {
			this.updateProgress();
		});

		this.player.onFinish(() => {
			this.isPlaying = false;
			this.progress = 1;
		});

		// Setup automatic cleanup
		$effect.root(() => {
			// Keep progress in sync
			$effect(() => {
				this.updateProgress();
			});

			// Keep volume in sync
			$effect(() => {
				this.player.setVolume(this.volume);
			});

			return () => {
				this.destroy();
			};
		});
	}

	private updateProgress() {
		this.progress = this.player.getCurrentTime() / this.player.getDuration() || 0;
	}

	togglePlayPause() {
		this.isPlaying = !this.isPlaying;
		this.player.togglePlayPause();
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
	}

	setVolume(value: number) {
		this.volume = Math.max(0, Math.min(1, value));
	}

	destroy() {
		this.player.destroy();
	}
} 