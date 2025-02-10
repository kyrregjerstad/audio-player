<script lang="ts">
	import type { PlayerOptions } from './createAudioPlayer.js';
	import { setAudioPlayer, type AudioPlayerState } from './audioPlayerAction.svelte.js';

	type Props = {
		class?: string;
		isPlaying?: boolean;
		progress?: number;
		volume?: number;
		currentTime?: number;
		duration?: number;
		togglePlayPause?: () => void;
		play?: () => void;
		pause?: () => void;
		stop?: () => void;
		setVolume?: (volume: number) => void;
	} & PlayerOptions;

	let {
		class: className,
		isPlaying = $bindable(false),
		progress = $bindable(0),
		volume = $bindable(1),
		currentTime = $bindable(0),
		duration = $bindable(0),
		togglePlayPause = $bindable(),
		play = $bindable(),
		pause = $bindable(),
		stop = $bindable(),
		setVolume = $bindable(),
		...options
	}: Props = $props();

	let element = $state<HTMLElement>();
	let playerState = $state<AudioPlayerState>();

	$effect(() => {
		if (element) {
			const state = setAudioPlayer({ node: element, options });
			playerState = state;

			// Bind state
			$effect(() => {
				isPlaying = state.isPlaying;
				progress = state.progress;
				volume = state.volume;
				currentTime = state.currentTime;
				duration = state.duration;
			});

			// Bind methods
			togglePlayPause = () => state.togglePlayPause();
			play = () => state.play();
			pause = () => state.pause();
			stop = () => state.stop();
			setVolume = (v: number) => state.setVolume(v);

			return () => {
				state.destroy();
			};
		}
	});
</script>

<div class={className} bind:this={element}></div>
