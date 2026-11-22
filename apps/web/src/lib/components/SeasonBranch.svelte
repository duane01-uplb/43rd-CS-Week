<script lang="ts">
	let { progress = 0, reduced = false, compact = false } = $props();
	const id = $props.id();
	const trunk = 'M98 367 C80 343 67 323 65 295 S82 250 75 219 S47 184 48 152 S70 109 64 83 S42 47 48 20';
	const sprays = [
		{ stem: 'M65 295 Q59 276 38 267 T18 244', fork: 'M38 267 Q29 250 34 237', x:18,y:244, fx:34,fy:237, at:.16, turn:-36, size:.87 },
		{ stem: 'M77 237 Q92 225 100 202 T117 180', fork: 'M100 202 Q108 207 124 194', x:117,y:180, fx:124,fy:194, at:.30, turn:22, size:1.03 },
		{ stem: 'M53 178 Q39 167 27 150 T14 124', fork: 'M27 150 Q30 133 23 122', x:14,y:124, fx:23,fy:122, at:.45, turn:-18, size:.8 },
		{ stem: 'M54 127 Q70 121 82 108 T107 93', fork: 'M82 108 Q79 97 89 83', x:107,y:93, fx:89,fy:83, at:.57, turn:34, size:.95 },
		{ stem: 'M64 83 Q48 79 34 62 T19 44', fork: 'M34 62 Q33 49 38 41', x:19,y:44, fx:38,fy:41, at:.68, turn:-12, size:.72 },
		{ stem: 'M50 45 Q56 33 69 27 T83 12', fork: 'M69 27 Q66 22 69 15', x:83,y:12, fx:69,fy:15, at:.78, turn:18, size:.69 }
	];
	const clamp = (n: number) => Math.max(0, Math.min(1, n));
	const opened = (n: number) => { const t = clamp(n); return t * t * (3 - 2*t); };
	const drawn = $derived(.15 + .85 * clamp(progress / .83));
	const lean = $derived(reduced ? 0 : 3.2 * Math.sin(progress * Math.PI * 2));
	const top = $derived(compact ? 348*(1-drawn) : -8);
</script>

<svg class="branch" viewBox={'-12 '+top+' 160 '+(380-top)} fill="none" aria-hidden="true" focusable="false">
	<defs>
		<mask id={id+'-ink'} maskUnits="userSpaceOnUse" x="-12" y="-8" width="160" height="388">
			<path d={trunk} pathLength="1" stroke="white" stroke-width="14" stroke-linecap="round" stroke-dasharray="1" stroke-dashoffset={1-drawn}/>
		</mask>
		<g id={id+'-flower'}>
			{#each [8, 83, 146, 224, 294] as angle,i}
				<g transform={'rotate('+angle+')'}>
					<path d="M0 1 C-3 0-7-4-6-8 Q-5-12-1-11 L.5-9 Q4-13 6-9 C8-5 4-1 0 1Z" fill={i%2 ? '#f7d7d6' : '#f0c1c6'} stroke="#ab7880" stroke-width=".6"/>
					<path d="M0 0Q-2-3-2-6" stroke="#c998a2" stroke-width=".55"/>
				</g>
			{/each}
			<circle r="2.1" fill="#a67a48"/>
			{#each [0,72,144,216,288] as angle}
				<path transform={'rotate('+angle+')'} d="M0 0L1-3.5" stroke="#a67a48" stroke-width=".7" stroke-linecap="round"/>
			{/each}
		</g>
		<g id={id+'-bud'}>
			<path d="M0 1Q-6-2-3-7Q-1-11 1-11Q6-7 4-3Z" fill="#cc8996"/>
			<path d="M0 1L-4-3L-1-2L3-5Q4-1 0 1" fill="#92676c"/>
		</g>
	</defs>
	<g class="bough" transform={'rotate('+lean+' 98 367)'}>
		<g mask={'url(#'+id+'-ink)'}>
			<path d="M95 368C78 344 63 322 62 295S79 250 73 220S45 183 46 152S68 109 63 83S41 47 48 20C44 52 62 62 65 83S52 134 50 152S73 198 77 219S67 275 68 295S84 344 101 365Z" fill="#765b51"/>
			<path d="M96 361Q72 327 68 309M66 292Q66 277 72 260M73 214Q67 199 59 190" stroke="#b3927f" stroke-width="1" stroke-linecap="round"/>
		</g>
		{#each sprays as spray}
			{@const twig = clamp((progress-spray.at)/.10)}
			{@const petals = opened((progress-spray.at-.105)/.105)}
			<g stroke="#806359" stroke-linecap="round">
				<path d={spray.stem} pathLength="1" stroke-dasharray="1" stroke-dashoffset={1-twig} stroke-width="1.65"/>
				<path d={spray.fork} pathLength="1" stroke-dasharray="1" stroke-dashoffset={1-clamp((twig-.45)/.55)} stroke-width=".95"/>
			</g>
			<g transform={'translate('+spray.x+' '+spray.y+') rotate('+spray.turn+') scale('+spray.size+')'} opacity={clamp((twig-.88)/.12)}>
				<g class="cluster">
					<path d="M0 0Q-4-4-7-5M0 0Q3-4 6-8" stroke="#98756a"/>
					<use href={'#'+id+'-bud'} transform="translate(6 -8) rotate(19) scale(.62)"/>
					<use href={'#'+id+'-bud'} transform="translate(-7 -5) rotate(-20) scale(.8)"/>
					<use href={'#'+id+'-flower'} transform={'translate(-7 -7) rotate(-22) scale('+petals+')'}/>
				</g>
			</g>
			<g transform={'translate('+spray.fx+' '+spray.fy+')'} opacity={clamp((twig-.9)*10)}>
				<use href={'#'+id+'-bud'} transform="scale(.7)"/>
				<use href={'#'+id+'-flower'} transform={'rotate('+(-spray.turn)+') scale('+(.62*petals)+' '+(.48*petals)+')'}/>
			</g>
		{/each}
	</g>
</svg>

<style>
	.branch { display:block; width:100%; height:100%; pointer-events:none; }
	@media (prefers-reduced-motion:no-preference) {
		.cluster { animation: breeze 6s ease-in-out infinite alternate; }
		@keyframes breeze { from { transform:rotate(-2deg) } to { transform:rotate(3deg) } }
	}
</style>
