# svelteSonic

simple audio player for svelte, based on [wavesurfer.js](https://github.com/katspaugh/wavesurfer.js). It's Svelte 5 runes for reactivity.

## Installation

```bash
pnpm i svelte-sonic
```

## Usage

```svelte
<script lang="ts">
	import { AudioPlayer } from 'svelte-sonic';

	let togglePlayPause = $state(() => {});
	let isPlaying = $state(false);
	let progress = $state(0);
</script>

<AudioPlayer
	src="/audio.mp3"
	barWidth={3}
	exclusive={true}
	bind:togglePlayPause
	bind:isPlaying
	bind:progress
/>
```
