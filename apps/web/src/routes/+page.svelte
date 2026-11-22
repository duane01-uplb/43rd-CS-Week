<script lang="ts">
	import { onMount } from 'svelte';
	import '@fontsource/cormorant-garamond/latin-500.css';
	import '@fontsource/cormorant-garamond/latin-500-italic.css';
	import SpecimenNote from '$lib/components/SpecimenNote.svelte';
	import SeasonBranch from '$lib/components/SeasonBranch.svelte';

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
			progress = Math.min(1, Math.max(0, window.scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight)));
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

<svelte:head><title>Sakura — A Season in Bloom</title></svelte:head>

<div class="journal" bind:this={story}>
	<a class="skip" href="#arrival">Skip to the story</a>
	<header class="mast frame">
		<a class="brand" href="#arrival" aria-label="Sakura, return to arrival">
			<svg viewBox="-14 -14 28 28" width="29" height="29" aria-hidden="true">
				{#each [0,72,144,216,288] as a}<path transform={'rotate('+a+')'} d="M0 0Q-8-5-5-11Q-4-13-1-12L0-9 2-12Q8-12 5-6Q3-2 0 0" fill="currentColor"/>{/each}
			</svg>Sakura
		</a>
		<nav aria-label="Journal navigation"><a href="#bloom">The bloom</a><a href="#culture">Culture</a><a href="#seasons">Seasons</a></nav>
		<a class="events" href="/cs-week">CS Week <span aria-hidden="true">↗</span></a>
	</header>
	<main>
		<section class="arrival frame" id="arrival" aria-labelledby="title">
			<div class="lead">
				<p class="folio"><i></i> 01 / 05 <span>The arrival</span></p>
				<h1 id="title" bind:this={arrival} tabindex="-1">Sakura<span lang="ja">桜</span></h1>
				<p class="subtitle">A Season in Bloom</p>
				<p class="introduction">Follow a cherry branch from its first bud to its falling petals, through the gardens and traditions of Japan.</p>
				<a class="begin" href="#bloom">Begin the journey <span aria-hidden="true">↓</span></a>
			</div>
			<figure class="hero-photo">
				<div class="sun" aria-hidden="true"></div>
				<div class="crop"><img src="/sakura/arrival.jpg" width="1536" height="1024" fetchpriority="high" alt="Ivory cherry blossoms and rose-colored buds clustered on a dark branch"/></div>
				<figcaption><span lang="ja">桜の季節</span><span>Cherry blossom season</span></figcaption>
			</figure>
		</section>
		<div class="chapter-rule frame"><span>Botanical journal</span><span lang="ja">春の記録</span></div>

		<section class="chapter bloom frame" id="bloom" aria-labelledby="bloom-title">
			<figure class="print bud"><img loading="lazy" src="/sakura/bud.jpg" alt="Closed pink buds beside a single newly opened cherry flower"/>
				<SpecimenNote label="Blossom note" note="A notch at the tip gives each cherry petal its characteristic shape." />
			</figure>
			<div class="copy"><p class="folio"><i></i> 02 / 05 <span>The bloom</span></p>
				<h2 id="bloom-title">Before the<br/><em>first petal.</em></h2>
				<p>Look closely at the tip of a bare twig. The first sign of spring is a tight cluster of buds, deeper pink than the flowers they shelter.</p>
				<p>As the buds loosen, their folded petals open to the light. Follow the branch along the margin as it comes into flower.</p>
			</div>
		</section>

		<section class="culture" id="culture" aria-labelledby="culture-title"><div class="chapter frame culture-grid">
			<div class="copy"><p class="folio"><i></i> 03 / 05 <span>Japanese culture</span></p>
				<h2 id="culture-title">Under the<br/><em>cherry trees.</em></h2>
				<p>During <em>hanami</em>, people gather to look at the blossoms. A picnic blanket, a shared meal and a flowering tree can turn an ordinary afternoon into an occasion.</p>
				<p>In a garden, a wooden veranda offers another vantage point. From the shade of the eaves, the flowers seem brighter still.</p>
			</div>
			<figure class="print veranda"><img loading="lazy" src="/sakura/veranda.jpg" alt="Cherry blossoms frame a timber veranda and tiled roof in a moss garden"/>
				<SpecimenNote label="The engawa" note="A veranda along the edge of a house makes a sheltered place to sit between room and garden." />
			</figure>
		</div></section>

		<section id="seasons" class="season" style:--tint={season.paper} style:--ink={season.color} aria-labelledby="seasons-title">
			<div class="frame chapter season-grid"><div class="copy">
				<p class="folio"><i></i> 04 / 05 <span>The seasons</span></p>
				<h2 id="seasons-title">One garden,<br/><em>four seasons.</em></h2>
				<div class="choices" role="group" aria-label="Choose a season">
					{#each seasons as option}<button aria-pressed={season === option} onclick={() => season = option}>{option.name}</button>{/each}
				</div>
				<p aria-live="polite">{season.text}</p>
			</div>
			<figure class="season-photo">
				{#key season.name}<img src={'/sakura/'+season.name.toLowerCase()+'.jpg'} alt={'A pavilion and garden pond in '+season.name.toLowerCase()} />{/key}
				<figcaption><span lang="ja">{season.jp}</span> {season.name}</figcaption>
			</figure></div>
		</section>

		<section id="petals" class="closing" aria-labelledby="closing-title">
			<div class="fall" aria-hidden="true">{#each [5,18,31,48,67,79,93] as left,i}<i style:left={left+'%'} style:animation-delay={-i*1.7+'s'}></i>{/each}</div>
			<div class="frame"><p class="folio"><i></i> 05 / 05 <span>The falling petals</span></p>
				<h2 id="closing-title">The flowers fall.<br/><em>Spring returns.</em></h2>
				<p>A few petals linger on the water. The branch will carry leaves until it is time to bloom again.</p>
				<button class="begin" onclick={replay}>Replay the journey <span aria-hidden="true">↺</span></button>
			</div>
		</section>
	</main>
	<footer class="frame"><span>Sakura <span lang="ja">桜</span></span><a href="/events">CS Week event schedule ↗</a></footer>
	<SeasonBranch progress={reduced ? 1 : progress} />
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
	.skip{position:absolute;left:1rem;top:-5rem;background:white;padding:.5rem;z-index:5}.skip:focus{top:.5rem}
	.mast{height:84px;display:flex;align-items:center;justify-content:space-between;gap:1rem;border-bottom:1px solid var(--rule)}
	.mast .brand{display:inline-flex;align-items:center;gap:.65rem;font:500 2.15rem/1 var(--serif);letter-spacing:-.04em}
	.brand svg{color:var(--beni)}
	.mast nav{display:flex;gap:2.25rem}.mast nav a,.events,footer a{font-size:.875rem}
	.mast a:hover,footer a:hover{color:var(--beni)}
	.events{border-left:1px solid var(--rule);padding-left:1.5rem}.events span{padding-left:.35rem}
	.arrival{display:grid;grid-template-columns:minmax(0,.83fr) minmax(0,1.17fr);gap:4%;align-items:center;padding-block:clamp(4rem,7.5vw,7rem) clamp(3rem,5vw,5rem)}
	.folio{display:flex;gap:.8rem;align-items:center;font-size:.67rem;font-weight:600;line-height:1.5;text-transform:uppercase;letter-spacing:.14em;color:var(--beni)}
	.folio i{width:1.8rem;height:1px;background:currentColor}.folio span{color:var(--muted)}
	.arrival h1{position:relative;display:flex;gap:.12em;align-items:flex-start;font-size:clamp(5rem,9.4vw,9.1rem);line-height:.94;margin:.26em 0 .035em}
	.arrival h1 span{font-size:.21em;color:var(--beni);line-height:1.5;letter-spacing:0;margin-top:.25em}
	.subtitle{font:italic 500 clamp(2rem,3.55vw,3.7rem)/1.1 var(--serif);letter-spacing:-.035em;color:var(--beni)}
	.lead .introduction{max-width:35ch;color:var(--muted);font-size:clamp(.96rem,1.2vw,1.1rem);margin:1.6rem 0 1.85rem}
	.journal .begin{display:inline-flex;align-items:center;justify-content:center;gap:1.6rem;background:var(--sumi);color:var(--paper);font-weight:500;line-height:1.4;font-family:inherit;font-size:.85rem;border:0;border-radius:2px;padding:.85rem 1.25rem;cursor:pointer}
	.journal .begin:hover{background:#55353b}.begin span{font-size:1.15rem}
	.hero-photo{position:relative;isolation:isolate}
	.sun{position:absolute;z-index:-1;right:-3.5%;top:-9%;width:27%;aspect-ratio:1;border-radius:50%;background:linear-gradient(150deg,#e1a3a0,#c57b78);animation:breathe 10s ease-in-out infinite alternate}
	.crop{aspect-ratio:1.35;overflow:hidden}.crop img{width:100%;height:110%;object-fit:cover;transform:translateY(calc(-5% + var(--drift,0px)))}
	.hero-photo figcaption,.chapter-rule,footer{display:flex;align-items:baseline;justify-content:space-between}
	.hero-photo figcaption,.season-photo figcaption{padding-top:.65rem;color:var(--muted);font-size:.76rem;letter-spacing:.03em}
	.hero-photo figcaption [lang=ja]{letter-spacing:.18em}
	.chapter-rule{border-top:1px solid var(--rule);padding-top:.6rem;font-size:.68rem;color:var(--muted);letter-spacing:.11em;text-transform:uppercase}
	.chapter{display:grid;align-items:center;gap:clamp(2rem,8vw,8rem);padding-block:clamp(4rem,8vw,8rem)}
	.bloom{grid-template-columns:.88fr 1.12fr}.culture-grid,.season-grid{grid-template-columns:.9fr 1.1fr}
	.copy{max-width:32rem}.journal h2{font-size:clamp(3.5rem,5.7vw,6rem);line-height:.94;margin:.38em 0}
	h2 em{font-weight:500;color:var(--beni)}
	.copy>p:not(.folio),.closing p:not(.folio){color:var(--muted);max-width:43ch;line-height:1.75}
	.copy>p+p{margin-top:1rem}
	.print{position:relative;overflow:hidden}.print img,.season-photo img{display:block;width:100%;object-fit:cover}
	.bud{width:88%;justify-self:center}.bud img{aspect-ratio:.83}.veranda img{aspect-ratio:1.12;object-position:50% 60%}
	.culture{background:#f0ebe4}
	@media(hover:hover){.print:hover img{transform:scale(1.025)}.print img{transition:transform .45s ease}}
	.season{background:var(--tint);transition:background-color .3s}.season h2 em,.season .folio{color:var(--ink)}
	.choices{display:flex;flex-wrap:wrap;gap:.2rem .85rem;margin-bottom:1.25rem}
	.choices button{border:0;border-bottom:2px solid transparent;background:transparent;color:var(--muted);padding:.5rem 0;font:inherit;cursor:pointer}
	.choices button[aria-pressed=true]{color:var(--ink);border-color:currentColor;font-weight:600}
	.season-photo img{aspect-ratio:1.45}.season-photo figcaption{display:flex;gap:.5rem;align-items:center;color:var(--ink)}
	.closing{position:relative;text-align:center;padding:clamp(5rem,10vw,10rem) 0;background:linear-gradient(var(--paper),#f7ecea);overflow:hidden}
	.closing .frame{position:relative}.closing .folio{justify-content:center}.closing p:not(.folio){margin:0 auto 1.5rem}.closing h2{margin:.25em 0}
	.fall{position:absolute;inset:0;pointer-events:none}.fall i{position:absolute;top:0;width:9px;height:15px;border-radius:80% 0 75% 15%;background:#dbabad;animation:fall 13s linear infinite}
	footer{padding-block:1.5rem;gap:1rem}footer>span{font:500 1.5rem var(--serif)}footer [lang=ja]{color:var(--beni);font-size:.8rem}
	@keyframes fall{from{transform:translate(-1rem,-2rem) rotate(-15deg);opacity:0}15%,80%{opacity:.65}to{transform:translate(4rem,65vh) rotate(230deg);opacity:0}}
	@keyframes breathe{to{transform:translateY(-4px);opacity:.88}}
	@keyframes enter{from{opacity:.5;transform:translateY(9px)}}
	@media(prefers-reduced-motion:no-preference){.lead h1,.print.revealed,.season-photo img{animation:enter .65s ease-out}}
	@media(max-width:780px){.frame{width:88%}.mast{height:68px}.mast nav{gap:1rem}.arrival{gap:4%;grid-template-columns:.95fr 1.05fr}.arrival h1{font-size:clamp(4.6rem,10vw,6rem)}.crop{aspect-ratio:.92}.chapter{gap:2rem}.bud{width:100%}}
	@media(max-width:620px){
		.mast{flex-wrap:wrap;height:auto;padding-block:.8rem .55rem;row-gap:.65rem}.mast .brand{font-size:1.8rem}.mast nav{order:3;flex-basis:100%;justify-content:space-between;border-top:1px solid var(--rule);padding-top:.5rem}.mast nav a{padding:.2rem 0}.events{padding-left:.7rem}
		.arrival,.chapter{grid-template-columns:minmax(0,1fr)}.arrival{padding-top:2.5rem;padding-bottom:1.75rem;gap:2.7rem}.arrival h1{font-size:clamp(5.25rem,19vw,7rem)}.lead .introduction{margin:1rem 0 1.25rem}.crop{aspect-ratio:1.5}.sun{width:23%}
		.chapter{padding-block:3.5rem}.bloom .copy{grid-row:1}.bud{width:80%;justify-self:start}.bud img{aspect-ratio:1.04}.veranda{width:88%;justify-self:end}
	}
	@media(prefers-reduced-motion:reduce){:global(html:has(.journal)){scroll-behavior:auto}.fall,.sun{animation:none}.fall{display:none}.print img,.season{transition:none}.print:hover img{transform:none}}
</style>
