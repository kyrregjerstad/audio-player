<script lang="ts">
	import { onMount } from 'svelte';
	import WaveSurfer, { type WaveSurferOptions } from 'wavesurfer.js';

	type Props = {
		src: string;
		isPlaying?: boolean;
		progress?: number;
		playPause?: () => void;
		stop?: () => void;
		setVolume?: (volume: number) => void;
		class?: string;
	} & Omit<WaveSurferOptions, 'container' | 'audioprocess' | 'finish' | 'stop'>;

	let {
		src,
		class: className,
		isPlaying = $bindable(false),
		progress = $bindable(0),
		playPause = $bindable(),
		stop = $bindable(),
		setVolume = $bindable(),
		...wavesurferRest
	}: Props = $props();

	let container = $state<HTMLDivElement>();
	let wavesurfer = $state<WaveSurfer>();

	onMount(() => {
		if (!container) return;
		wavesurfer = WaveSurfer.create({
			...wavesurferRest,
			container
		});

		wavesurfer.load(src);

		wavesurfer.on('audioprocess', (e) => {
			progress = wavesurfer!.getCurrentTime() / wavesurfer!.getDuration();
		});

		wavesurfer.on('finish', () => {
			isPlaying = false;
			progress = 1;
		});
	});

	playPause = () => {
		wavesurfer?.playPause();
		isPlaying = wavesurfer?.isPlaying() || false;
	};

	stop = () => {
		wavesurfer?.stop();
		isPlaying = false;
		progress = 0;
	};

	setVolume = (volume: number) => wavesurfer?.setVolume(volume);
</script>

<div class={className} bind:this={container}></div>
