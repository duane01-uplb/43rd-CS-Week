<script lang="ts">
	import { onMount } from 'svelte';
	import SpecimenNote from '$lib/components/SpecimenNote.svelte';
	import SeasonBranch from '$lib/components/SeasonBranch.svelte';

	import EventAgenda from '$lib/components/EventAgenda.svelte';
	import HeroEmblem from '$lib/components/HeroEmblem.svelte';
	import { program } from '$lib/program';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
	let programSection: HTMLElement;
	let cultureSection: HTMLElement;
	let closingSection: HTMLElement;
	let firstBreak: HTMLDivElement;
	let programBreak: HTMLDivElement;
	let finalBreak: HTMLDivElement;
	let breakStages = $state([.18, .46, 1]);

	const seasons = [
		{ name: 'Spring', jp: '春', color: '#8c404c', paper: '#f7e9e8', text: 'Pale flowers gather at the water’s edge. For a few days, even the pond seems to be in bloom.' },
		{ name: 'Summer', jp: '夏', color: '#405a43', paper: '#e7ebe1', text: 'A green canopy closes over the pond. The shade beneath the cherry trees deepens as the days grow long.' },
		{ name: 'Autumn', jp: '秋', color: '#8a4133', paper: '#f1e4d9', text: 'Maples turn the garden crimson. Across the water, the roofline catches the last warm light.' },
		{ name: 'Winter', jp: '冬', color: '#465763', paper: '#eeefec', text: 'Snow rests on the pavilion roof. Against the pale sky, every fork of the bare branches is visible.' }
	];
	let season = $state.raw(seasons[0]);
	let progress = $state(0);
	let reduced = $state(false);
	let story: HTMLDivElement;
	let arrival: HTMLHeadingElement;

	onMount(() => {
		const preference = matchMedia('(prefers-reduced-motion: reduce)');
		let frame = 0;
		const update = () => {
			frame = 0;
			reduced = preference.matches;
			const y = window.scrollY;
			const anchors = [0, ...[programSection, cultureSection, closingSection].map(el =>
				Math.max(1, y + el.getBoundingClientRect().top - innerHeight * .65))];
			const stages = [0, .30, .72, 1];
			let value = 0;
			for (let i = 1; i < anchors.length; i++) {
				const segment = Math.max(0, Math.min(1, (y - anchors[i-1]) / Math.max(1, anchors[i] - anchors[i-1])));
				value += (stages[i] - stages[i-1]) * segment;
			}
			progress = reduced ? stages[anchors.filter(a => y >= a).length - 1] : value;
			if (innerWidth < 960 || finalBreak.getBoundingClientRect().top < innerHeight) {
				const entering = (el: HTMLElement) => Math.max(0, Math.min(1,
					(innerHeight - el.getBoundingClientRect().top) / (innerHeight * .58)));
				breakStages = reduced ? [.18, .46, 1] : [
					.10 + .24 * entering(firstBreak),
					.32 + .39 * entering(programBreak),
					.76 + .24 * entering(finalBreak)
				];
			}
			story.style.setProperty('--drift', reduced ? '0px' : Math.min(16, window.scrollY * .035)+'px');
		};
		const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
		update();
		window.addEventListener('scroll', schedule, { passive: true });
		window.addEventListener('resize', schedule);
		preference.addEventListener('change', update);
		const reveal = new IntersectionObserver(entries => {
			for (const item of entries) if (item.isIntersecting) {
				item.target.classList.add('revealed');
				reveal.unobserve(item.target);
			}
		});
		story.querySelectorAll('.print').forEach(el => reveal.observe(el));
		return () => {
			cancelAnimationFrame(frame);
			reveal.disconnect();
			window.removeEventListener('scroll', schedule);
			window.removeEventListener('resize', schedule);
			preference.removeEventListener('change', update);
		};
	});
	function replay() {
		season = seasons[0];
		arrival.focus({preventScroll:true});
		window.scrollTo({top:0, behavior:reduced?'instant':'smooth'});
	}
</script>

<svelte:head><title>CASC4D3 — 43rd Computer Science Week</title><meta name="description" content="Explore the program and register for the 43rd Computer Science Week at UPLB."/></svelte:head>

<div class="journal" bind:this={story}>
	<div class="spine" aria-hidden="true"><SeasonBranch {progress} {reduced}/></div>

		<section class="arrival frame" id="arrival" aria-labelledby="title">
			<div class="lead" id="intro">
				<p class="edition">43rd Computer Science Week</p>
				<h1 id="title" bind:this={arrival} tabindex="-1">CASC4D3<span lang="ja">桜</span></h1>
				<p class="subtitle">Towards a Resilient Human-Centered Computing</p>
				<p class="introduction">The annual flagship event of the UPLB Computer Science Society. Discover the program and register for the sessions you want to join.</p>
				<a class="begin" href="/events">View event schedule <span aria-hidden="true">→</span></a>
			</div>
			<figure class="hero-photo">
				<div class="sun" aria-hidden="true"></div>
				<div class="crop"><img src="/sakura/arrival.jpg" width="1536" height="1024" fetchpriority="high" alt="Ivory cherry blossoms and rose-colored buds clustered on a dark branch"/></div>
				<figcaption><span lang="ja">桜の季節</span><span>Cherry blossom season</span></figcaption>
			</figure>
		</section>
		<div class="mobile-branch" id="bloom" bind:this={firstBreak}><SeasonBranch progress={breakStages[0]} {reduced} compact/></div>
	<section id="event" class="agenda paper" aria-labelledby="agenda-title"><div class="frame">
		<h2 id="agenda-title">Upcoming events</h2><p class="timezone">Manila time</p>
		{#await data.summary}
			<p>Loading upcoming events…</p><noscript><a href="/?render=full#event">Load upcoming events</a></noscript>
		{:then summary}
			{#if !summary}<p>Upcoming events couldn’t load.</p>
			{:else if summary.upcoming.length}<EventAgenda events={summary.upcoming} preview/>
			{:else}<p>No upcoming events are open for registration.</p>{/if}
		{:catch}<p>Upcoming events couldn’t load.</p>{/await}
		<a class="text-link" href="/events">View full schedule →</a>
	</div></section>

	<section id="program" class="frame program" bind:this={programSection} aria-labelledby="program-title">
		<div class="mobile-branch" bind:this={programBreak}><SeasonBranch progress={breakStages[1]} {reduced} compact/></div>
		<span id="tracks"></span><span id="experience"></span><h2 id="program-title">Explore the program</h2>
		{#each program as area,i}
			<article class="split spread" class:reverse={i % 2 === 1}>
				<figure class="print"><img loading="lazy" src={area.image} alt=""/></figure>
				<div class="copy"><h3>{area.title}</h3><p>{area.description}</p>
					{#await data.summary}<a class="text-link" href="/events">Browse the schedule →</a>
					{:then summary}
						{@const event = summary?.programEvents.find(item => area.aliases.includes(item.title.trim().toLowerCase()))}
						<a class="text-link" href={event ? '/events/'+event.id : '/events'}>{event ? 'View event' : 'Browse the schedule'} →</a>
					{:catch}<a class="text-link" href="/events">Browse the schedule →</a>{/await}
				</div>
			</article>
		{/each}
	</section>

	<section id="seasons" bind:this={cultureSection} class="season" style:--tint={season.paper} style:--ink={season.color} aria-labelledby="seasons-title">
			<div class="frame chapter season-grid"><div class="copy">
				<h2 id="seasons-title">One garden,<br/><em>four seasons.</em></h2>
				<p>During <em>hanami</em> (<span lang="ja">花見</span>), people gather beneath flowering cherry trees to share a meal and enjoy the blossoms. Visit the same garden through the seasons.</p>
				<span id="culture"></span><div class="choices" role="group" aria-label="Choose a season">
					{#each seasons as option}<button aria-pressed={season === option} onclick={() => season = option}>{option.name}</button>{/each}
				</div>
				<p aria-live="polite">{season.text}</p>
			</div>
			<figure class="season-photo">
				{#key season.name}<img src={'/sakura/'+season.name.toLowerCase()+'.jpg'} alt={'A pavilion and garden pond in '+season.name.toLowerCase()} />{/key}
				<SpecimenNote label="Blossom note" note="A notch at the tip gives each cherry petal its characteristic shape." />
				<figcaption><span lang="ja">{season.jp}</span> {season.name}</figcaption>
			</figure></div>
		</section>

		<section id="how-it-works" bind:this={closingSection} class="participate paper">
		<div id="petals" class="closing-branch" bind:this={finalBreak}><SeasonBranch progress={breakStages[2]} {reduced}/></div>
		<div class="frame split">
			<div class="copy"><h2>How to register</h2>
				<ol id="register"><li><strong>Choose your event.</strong> Check the time and registration details in the schedule.</li>
				<li><strong>Submit your responses.</strong> Complete the event form. No account is required for CS Week forms.</li>
				<li><strong>Check your confirmation.</strong> On external registration sites, follow the organizer’s instructions.</li></ol>
				<a class="begin" href="/events">Browse events →</a>
			</div>
			<figure class="organizer"><HeroEmblem/><figcaption>Organized by the UPLB Computer Science Society</figcaption></figure>
		</div>
		<button class="replay" onclick={replay}>Replay the bloom ↺</button>
	</section>
</div>

<style>
	:global(html:has(.journal)){scroll-behavior:smooth;background:#faf8f3}
	.journal{--paper:#faf8f3;--sumi:#292326;--muted:#625955;--beni:#91454f;--rule:#d9d0c8;--serif:'Cormorant Garamond',Georgia,serif;background:var(--paper);color:var(--sumi);font:400 1rem/1.6 'Helvetica Neue',Helvetica,sans-serif;overflow:clip}
	.frame{width:min(1240px,88%);margin-inline:auto}
	.journal :is(h1,h2,p,figure){margin:0}
	.journal :is(h1,h2){font-family:var(--serif);font-weight:500;color:var(--sumi);letter-spacing:-.055em}
	.journal [lang=ja]{font-family:'Noto Serif JP','Yu Mincho','MS PMincho',serif;font-weight:400}
	.journal a{color:inherit;text-decoration:none}
	.journal :is(a,button,summary):focus-visible{outline:2px solid var(--beni);outline-offset:4px}
	.arrival{display:grid;grid-template-columns:minmax(0,.83fr) minmax(0,1.17fr);gap:4%;align-items:center;padding-block:clamp(4rem,7.5vw,7rem) clamp(3rem,5vw,5rem)}
	.edition,.timezone{font-size:.9rem;color:var(--muted)}
	.agenda .timezone{margin-bottom:1rem}
	.arrival h1{position:relative;display:flex;gap:.12em;align-items:flex-start;font-size:clamp(5rem,9.4vw,9.1rem);line-height:.94;margin:.26em 0 .035em}
	.arrival h1 span{font-size:.21em;color:var(--beni);line-height:1.5;letter-spacing:0;margin-top:.25em}
	.subtitle{font:italic 500 clamp(2rem,3.55vw,3.7rem)/1.1 var(--serif);letter-spacing:-.035em;color:var(--beni)}
	.lead .introduction{max-width:35ch;color:var(--muted);font-size:clamp(.96rem,1.2vw,1.1rem);margin:1.6rem 0 1.85rem}
	.journal .begin{display:inline-flex;align-items:center;justify-content:center;gap:1.6rem;background:var(--sumi);color:var(--paper);font-weight:500;line-height:1.4;font-family:inherit;font-size:.85rem;border:0;border-radius:2px;padding:.85rem 1.25rem;cursor:pointer}
	.journal .begin:hover{background:#55353b}.begin span{font-size:1.15rem}
	.hero-photo{position:relative;isolation:isolate}
	.sun{position:absolute;z-index:-1;right:-3.5%;top:-9%;width:27%;aspect-ratio:1;border-radius:50%;background:linear-gradient(150deg,#e1a3a0,#c57b78);animation:breathe 10s ease-in-out infinite alternate}
	.crop{aspect-ratio:1.35;overflow:hidden}.crop img{width:100%;height:110%;object-fit:cover;transform:translateY(calc(-5% + var(--drift,0px)))}
	.hero-photo figcaption{display:flex;align-items:baseline;justify-content:space-between}
	.hero-photo figcaption,.season-photo figcaption{padding-top:.65rem;color:var(--muted);font-size:.76rem;letter-spacing:.03em}
	.hero-photo figcaption [lang=ja]{letter-spacing:.18em}
	.chapter{display:grid;align-items:center;gap:clamp(2rem,8vw,8rem);padding-block:clamp(4rem,8vw,8rem)}
	.season-grid{grid-template-columns:.9fr 1.1fr}
	.copy{max-width:32rem}.journal h2{font-size:clamp(3.5rem,5.7vw,6rem);line-height:.94;margin:.38em 0}
	h2 em{font-weight:500;color:var(--beni)}
	.copy>p{color:var(--muted);max-width:43ch;line-height:1.75}
	.copy>p+p{margin-top:1rem}
	.print{position:relative;overflow:hidden}.print img,.season-photo img{display:block;width:100%;object-fit:cover}
	@media(hover:hover){.print:hover img{transform:scale(1.025)}.print img{transition:transform .45s ease}}
	.season{background:var(--tint);transition:background-color .3s}.season h2 em{color:var(--ink)}
	.choices{display:flex;flex-wrap:wrap;gap:.2rem .85rem;margin-bottom:1.25rem}
	.choices button{border:0;border-bottom:2px solid transparent;background:transparent;color:var(--muted);padding:.5rem 0;font:inherit;cursor:pointer}
	.choices button[aria-pressed=true]{color:var(--ink);border-color:currentColor;font-weight:600}
	.season-photo img{aspect-ratio:1.45}.season-photo figcaption{display:flex;gap:.5rem;align-items:center;color:var(--ink)}
	@keyframes breathe{to{transform:translateY(-4px);opacity:.88}}
	@keyframes enter{from{opacity:.5;transform:translateY(9px)}}
	@media(prefers-reduced-motion:no-preference){.lead h1,.print.revealed,.season-photo img{animation:enter .65s ease-out}}
	@media(max-width:780px){.frame{width:88%}.crop{aspect-ratio:.92}}
	@media(max-width:620px){
		.arrival,.chapter{grid-template-columns:minmax(0,1fr)}.arrival{padding-top:2.5rem;padding-bottom:1.75rem;gap:2.7rem}.arrival h1{font-size:clamp(5.25rem,19vw,7rem)}.lead .introduction{margin:1rem 0 1.25rem}.crop{aspect-ratio:1.5}.sun{width:23%}
		.chapter{padding-block:3.5rem}.bloom .copy{grid-row:1}.bud{width:80%;justify-self:start}.bud img{aspect-ratio:1.04}.veranda{width:88%;justify-self:end}
	}
	@media(prefers-reduced-motion:reduce){:global(html:has(.journal)){scroll-behavior:auto}.sun{animation:none}.print img,.season{transition:none}.print:hover img{transform:none}}

	.journal {position:relative}
	.spine {position:sticky;top:17vh;height:0;z-index:1;pointer-events:none}
	.spine :global(svg){width:clamp(96px,10vw,160px);height:65vh;margin:auto}
	.arrival,.split,.season-grid {display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:clamp(96px,10vw,160px);align-items:center}
	.arrival h1{font-size:clamp(4rem,6.8vw,6.9rem)}
	.subtitle{font-size:clamp(2rem,3vw,3rem)}
	.paper {position:relative;z-index:2;background:var(--paper);border-block:1px solid var(--rule)}
	.agenda,.participate,.program{padding-block:clamp(2.5rem,5vw,5rem)}
	.agenda h2,.program>h2,.participate h2{font-size:clamp(2.8rem,4.8vw,4.75rem)}
	.program>h2{max-width:45%}
	.spread{padding-block:2rem}.spread .print img{aspect-ratio:1.7}.spread h3{font:500 clamp(2rem,4vw,3.8rem)/1.05 var(--serif);margin:0 0 1rem}
	.reverse .print{grid-column:2;grid-row:1}.reverse .copy{grid-column:1;grid-row:1}
	.journal .text-link,.replay{display:inline-block;margin-top:1rem;color:var(--beni);font-weight:600;text-decoration:underline;text-underline-offset:.25rem}
	.choices{margin-top:1rem}.season-photo{position:relative}.season-photo :global(.note){bottom:3rem}
	.mobile-branch{display:none}
	.closing-branch{width:clamp(110px,11vw,160px);height:clamp(180px,25vw,320px);margin:0 auto 1rem}
	.participate ol{padding-left:1.35rem;list-style:decimal;margin-block:1rem 1.5rem}.participate li{padding:.45rem}
	.organizer{text-align:center}.organizer :global(.emblem){margin:auto;width:min(80%,18rem)}.organizer figcaption{font-size:.85rem;color:var(--muted)}
	.replay{display:block;margin:2rem auto 0;border:0;background:none;cursor:pointer}
	@media(max-width:959px){
		.spine{display:none}.mobile-branch{display:block;width:90px;height:120px;margin:auto}
		.arrival,.split,.season-grid{gap:clamp(1.5rem,4vw,3rem)}.program>h2{max-width:none}
	}
	@media(max-width:620px){
		.arrival,.split,.season-grid{grid-template-columns:minmax(0,1fr)}.arrival h1{font-size:clamp(3.9rem,13vw,5.4rem)}
		.spread{gap:1rem}.reverse .print,.reverse .copy{grid-column:auto;grid-row:auto}
	}
</style>
