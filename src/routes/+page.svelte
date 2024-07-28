<script lang="ts">
	import AudioPlayer from '$lib/AudioPlayer.svelte';

	let playPause1 = $state(() => {});
	let playPause2 = $state(() => {});
	let isPlaying1 = $state(false);
	let isPlaying2 = $state(false);
	let progress1 = $state(0);
	let progress2 = $state(0);
</script>

<AudioPlayer
	src="/audio/voice-sample-1.mp3"
	barWidth={3}
	exclusive={true}
	bind:togglePlayPause={playPause1}
	bind:isPlaying={isPlaying1}
	bind:progress={progress1}
/>
<AudioPlayer
	src="/audio/voice-sample-1.mp3"
	barWidth={3}
	bind:togglePlayPause={playPause2}
	bind:isPlaying={isPlaying2}
	bind:progress={progress2}
/>

<button onclick={playPause1}> {isPlaying1 ? 'Pause' : 'Play'} </button>
<button onclick={playPause2}> {isPlaying2 ? 'Pause' : 'Play'} </button>

<div>
	<span>Progress 1: {progress1}</span>
	<span>Progress 2: {progress2}</span>
</div>
