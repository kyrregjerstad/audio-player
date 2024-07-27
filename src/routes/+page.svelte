<script lang="ts">
	import AudioPlayer from '../lib/AudioPlayer.svelte';

	let playPause1 = $state(() => {});
	let playPause2 = $state(() => {});
	let isPlaying1 = $state(false);
	let isPlaying2 = $state(false);
</script>

<AudioPlayer
	src="/audio/voice-sample-1.mp3"
	barWidth={3}
	exclusive={true}
	bind:playPause={playPause1}
	bind:isPlaying={isPlaying1}
/>
<AudioPlayer
	src="/audio/voice-sample-1.mp3"
	barWidth={3}
	exclusive={true}
	bind:playPause={playPause2}
	bind:isPlaying={isPlaying2}
/>

<button onclick={playPause1}> {isPlaying1 ? 'Pause' : 'Play'} </button>
<button onclick={playPause2}> {isPlaying2 ? 'Pause' : 'Play'} </button>
