export function createScrollSound(ctx: AudioContext) {
	let lastPlayedAt = -Infinity;

	return (intensity: number) => {
		if (ctx.state !== 'running') return;
		const now = ctx.currentTime;
		if (now - lastPlayedAt < 0.22) return;
		lastPlayedAt = now;

		const seconds = 0.24;
		const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate);
		const data = buffer.getChannelData(0);
		for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.42;

		const src = ctx.createBufferSource();
		src.buffer = buffer;
		const filter = ctx.createBiquadFilter();
		filter.type = 'bandpass';
		filter.frequency.value = 1320 + intensity * 860;
		filter.Q.value = 7.5;
		const gain = ctx.createGain();
		const peak = 0.024 + intensity * 0.036;
		gain.gain.setValueAtTime(0.0001, now);
		gain.gain.exponentialRampToValueAtTime(peak, now + 0.02);
		gain.gain.exponentialRampToValueAtTime(0.0001, now + seconds);
		src.connect(filter);
		filter.connect(gain);
		gain.connect(ctx.destination);
		src.start(now);
		src.stop(now + seconds);
	};
}
