<script lang="ts" context="module">
	let globalIsPlaying = $state(false);
	let globalPlayPause = $state<(() => void)[]>([]);
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import WaveSurfer, { type WaveSurferOptions } from 'wavesurfer.js';

	type Props = {
		src: string;
		isPlaying?: boolean;
		progress?: number;
		playPause?: () => void;
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
		playPause = $bindable(),
		stop = $bindable(),
		pause = $bindable(() => {
			if (exclusive && globalIsPlaying) {
				globalPlayPause.forEach((fn) => fn());
			}
		}),
		setVolume = $bindable(),
		exclusive = false,
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
			if (exclusive) {
				globalIsPlaying = false;
			}
		});
	});

	pause = () => {
		wavesurfer?.pause();
		isPlaying = false;
		globalPlayPause = globalPlayPause.filter((fn) => fn !== pause);
		if (globalPlayPause.length === 0) {
			globalIsPlaying = false;
		}
	};

	playPause = () => {
		if (exclusive && globalIsPlaying && !isPlaying) {
			globalPlayPause.forEach((fn) => fn());
		}

		wavesurfer?.playPause();
		isPlaying = wavesurfer?.isPlaying() || false;

		if (isPlaying) {
			if (exclusive) {
				globalPlayPause.push(pause);
				globalIsPlaying = true;
			}
		} else {
			pause();
		}
	};

	stop = () => {
		wavesurfer?.stop();
		isPlaying = false;
		progress = 0;
		globalPlayPause = globalPlayPause.filter((fn) => fn !== stop);
		if (globalPlayPause.length === 0) {
			globalIsPlaying = false;
		}
	};

	setVolume = (volume: number) => wavesurfer?.setVolume(volume);
</script>

<div class={className} bind:this={container}></div>
