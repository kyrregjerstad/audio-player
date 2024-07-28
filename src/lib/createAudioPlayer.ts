import WaveSurfer, { type WaveSurferOptions } from 'wavesurfer.js';

export interface IAudioPlayer {
	togglePlayPause: () => void;
	pause: () => void;
	stop: () => void;
	setVolume: (volume: number) => void;
	isPlaying: () => boolean;
	onAudioProcess: (callback: () => void) => void;
	onFinish: (callback: () => void) => void;
	destroy: () => void;
	getCurrentTime: () => number;
	getDuration: () => number;
}

export type PlayerOptions = Omit<
	WaveSurferOptions,
	'container' | 'audioprocess' | 'finish' | 'stop'
> & { src: string; exclusive?: boolean };
/**
 * wrapper for wavesurfer.js for easy dependency injection
 */
export function createAudioPlayer(container: HTMLElement, options: PlayerOptions): IAudioPlayer {
	const wavesurfer = WaveSurfer.create({
		...options,
		container
	});
	wavesurfer.load(options.src);

	return {
		togglePlayPause: () => wavesurfer.playPause(),
		pause: () => wavesurfer.pause(),
		stop: () => wavesurfer.stop(),
		setVolume: (volume: number) => wavesurfer.setVolume(volume),
		isPlaying: () => wavesurfer.isPlaying(),
		onAudioProcess: (callback: () => void) => wavesurfer.on('audioprocess', callback),
		onFinish: (callback: () => void) => wavesurfer.on('finish', callback),
		destroy: () => wavesurfer.destroy(),
		getCurrentTime: () => wavesurfer.getCurrentTime(),
		getDuration: () => wavesurfer.getDuration()
	};
}
