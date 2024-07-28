/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AudioPlayerInstance } from './AudioPlayerInstance.svelte.js';

vi.mock('./CreateAudioPlayer', () => ({
	createAudioPlayer: vi.fn().mockImplementation((_container, _options) => ({
		togglePlayPause: vi.fn(),
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

describe('AudioPlayerInstance', () => {
	let container: HTMLElement;
	let playerInstance: AudioPlayerInstance;

	beforeEach(() => {
		container = document.createElement('div');
		playerInstance = new AudioPlayerInstance(container, { exclusive: true, src: '' });
	});

	it('should initialize with default values', () => {
		expect(playerInstance.isPlaying).toBe(false);
		expect(playerInstance.progress).toBe(0);
	});

	it('should toggle play/pause state', () => {
		playerInstance.togglePlayPause();
		expect(playerInstance.isPlaying).toBe(true);

		playerInstance.togglePlayPause();
		expect(playerInstance.isPlaying).toBe(false);
	});

	it('should pause the player', () => {
		playerInstance.pause();
		expect(playerInstance.isPlaying).toBe(false);
	});

	it('should stop the player and reset progress', () => {
		playerInstance.stop();
		expect(playerInstance.isPlaying).toBe(false);
		expect(playerInstance.progress).toBe(0);
	});

	it('should set the volume', () => {
		playerInstance.setVolume(0.5);
		expect(playerInstance.player.setVolume).toHaveBeenCalledWith(0.5);
	});

	it('should destroy the player instance', () => {
		playerInstance.destroy();
		expect(playerInstance.player.destroy).toHaveBeenCalled();
	});
});
