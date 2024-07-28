<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { type WaveSurferOptions } from 'wavesurfer.js';
	import { AudioPlayerManager, setAudioPlayer } from './audioPlayer.svelte.js';

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
	let audioPlayerManager = $state<AudioPlayerManager>();

	onMount(() => {
		audioPlayerManager = setAudioPlayer(container, src, wavesurferRest, exclusive);

		togglePlayPause = () => audioPlayerManager?.playPause();
		pause = () => audioPlayerManager?.pause();
		stop = () => audioPlayerManager?.stop();
		setVolume = (volume: number) => audioPlayerManager?.setVolume(volume);

		isPlaying = audioPlayerManager.isPlayingState;
		progress = audioPlayerManager.progressState;
	});
</script>

<div class={className} bind:this={container}></div>
