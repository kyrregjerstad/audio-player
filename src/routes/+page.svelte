<script lang="ts">
	import AudioPlayer from '../lib/AudioPlayer.svelte';

	let playPause = $state(() => {});
	let isPlaying = $state(false);
	let progress = $state(0);
</script>

<AudioPlayer
	src="/audio/voice-sample-1.mp3"
	barWidth={3}
	bind:playPause
	bind:isPlaying
	bind:progress
/>

<button onclick={playPause}> {isPlaying ? 'Pause' : 'Play'} </button>

<div>
	progress = {progress}
</div>
