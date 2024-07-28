<script lang="ts">
	import { type WaveSurferOptions } from 'wavesurfer.js';
	import type { AudioPlayerInstance } from './AudioPlayerInstance.svelte.js';
	import { onDestroy, onMount } from 'svelte';
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
	let audioPlayer = $state<AudioPlayerInstance>();

	onMount(() => {
		audioPlayer = setAudioPlayer(container, src, wavesurferRest, exclusive);

		togglePlayPause = () => audioPlayer?.togglePlayPause();
		pause = () => audioPlayer?.pause();
		togglePlayPause;
		stop = () => audioPlayer?.stop();
		setVolume = (volume: number) => audioPlayer?.setVolume(volume);

		$effect(() => {
			progress = audioPlayer?.progressState || 0;
			isPlaying = audioPlayer?.isPlayingState || false;
		});
	});

	onDestroy(() => {
		audioPlayer?.destroy();
	});
</script>

<div class={className} bind:this={container}></div>
