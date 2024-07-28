/* eslint-disable @typescript-eslint/no-unused-vars */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AudioPlayerInstance } from './AudioPlayerInstance.svelte.js';
import { AudioPlayerManager } from './audioPlayerManager.svelte.js';

vi.mock('./CreateAudioPlayer', () => ({
	createAudioPlayer: vi.fn().mockImplementation((_container, _options) => ({
		playPause: vi.fn(),
		pause: vi.fn(),
		stop: vi.fn(),
		setVolume: vi.fn(),
		isPlaying: vi.fn().mockReturnValue(false),
		onAudioProcess: vi.fn((_callback) => {}),
		onFinish: vi.fn((_callback) => {}),
		destroy: vi.fn(),
		getCurrentTime: vi.fn().mockReturnValue(0),
		getDuration: vi.fn().mockReturnValue(100)
	}))
}));

describe('AudioPlayerManager', () => {
	let container: HTMLElement;
	let playerInstance: AudioPlayerInstance;

	beforeEach(() => {
		container = document.createElement('div');
		playerInstance = new AudioPlayerInstance(container, { exclusive: true, src: '' });
		AudioPlayerManager.players = [];
	});

	it('should register and unregister a player', () => {
		AudioPlayerManager.registerPlayer(playerInstance);
		expect(AudioPlayerManager.players).toContain(playerInstance);

		AudioPlayerManager.unregisterPlayer(playerInstance);
		expect(AudioPlayerManager.players).not.toContain(playerInstance);
	});

	it('should manage global play/pause state', () => {
		AudioPlayerManager.setGlobalIsPlaying(true);
		expect(AudioPlayerManager.getGlobalIsPlaying()).toBe(true);

		AudioPlayerManager.setGlobalIsPlaying(false);
		expect(AudioPlayerManager.getGlobalIsPlaying()).toBe(false);
	});

	it('should manage global play/pause callbacks', () => {
		const callback = vi.fn();
		AudioPlayerManager.addGlobalPlayPause(callback);
		expect(AudioPlayerManager.getGlobalPlayPause()).toContain(callback);

		AudioPlayerManager.removeGlobalPlayPause(callback);
		expect(AudioPlayerManager.getGlobalPlayPause()).not.toContain(callback);
	});
});
