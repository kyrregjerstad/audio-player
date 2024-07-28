<script lang="ts">
	import { onMount } from 'svelte';
	import { type WaveSurferOptions } from 'wavesurfer.js';
	import type { AudioPlayerInstance } from './AudioPlayerInstance.svelte.js';
	import { setAudioPlayer } from './audioPlayerManager.svelte.js';

	type Props = {
		src: string;
		isPlaying?: boolean;
		progress?: number;
		togglePlayPause?: () => void;
		play?: () => void;
		pause?: () => void;
		stop?: () => void;
		setVolume?: (volume: number) => void;
		class?: string;
		exclusive?: boolean;
	} & Omit<WaveSurferOptions, 'container' | 'audioprocess' | 'finish' | 'stop'>;

	let {
		src,
		class: className,
		isPlaying = $bindable(false),
		progress = $bindable(0),
		togglePlayPause = $bindable(),
		play = $bindable(),
		stop = $bindable(),
		pause = $bindable(),
		setVolume = $bindable(),
		exclusive = false,
		...wavesurferRest
	}: Props = $props();

	let container: HTMLDivElement;
	let audioPlayer = $state<AudioPlayerInstance | null>(null);

	onMount(() => {
		audioPlayer = setAudioPlayer(container, src, wavesurferRest, exclusive);

		togglePlayPause = () => audioPlayer?.playPause();
		pause = () => audioPlayer?.pause();
		stop = () => audioPlayer?.stop();
		setVolume = (volume: number) => audioPlayer?.setVolume(volume);

		isPlaying = audioPlayer.isPlayingState;
		progress = audioPlayer.progressState;

		console.log('progress', progress);
	});
</script>

<div class={className} bind:this={container}></div>
