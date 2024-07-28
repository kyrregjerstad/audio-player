<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { AudioPlayerInstance } from './AudioPlayerInstance.svelte.js';
	import { setAudioPlayer } from './audioPlayerManager.svelte.js';
	import type { PlayerOptions } from './createAudioPlayer.js';

	type Props = {
		isPlaying?: boolean;
		progress?: number;
		togglePlayPause?: () => void;
		play?: () => void;
		pause?: () => void;
		stop?: () => void;
		setVolume?: (volume: number) => void;
		class?: string;
	} & PlayerOptions;

	let {
		class: className,
		isPlaying = $bindable(false),
		progress = $bindable(0),
		togglePlayPause = $bindable(),
		play = $bindable(),
		stop = $bindable(),
		pause = $bindable(),
		setVolume = $bindable(),
		...rest
	}: Props = $props();

	let container: HTMLDivElement;
	let audioPlayer = $state<AudioPlayerInstance>();

	onMount(() => {
		audioPlayer = setAudioPlayer({ container, options: rest });

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
