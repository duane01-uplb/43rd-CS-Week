<svg class="sakura-wind" viewBox="0 0 1440 900" preserveAspectRatio="none" fill="none" aria-hidden="true">
	<defs>
		<linearGradient id="sakura-wind-color" gradientUnits="userSpaceOnUse" x1="0" x2="1440" y1="0" y2="0">
			<stop stop-color="#c25072" stop-opacity="0" />
			<stop offset=".24" stop-color="#a63a5c" stop-opacity=".5" />
			<stop offset=".53" stop-color="#c25072" stop-opacity=".25" />
			<stop offset=".76" stop-color="#c25072" stop-opacity=".48" />
			<stop offset="1" stop-color="#c25072" stop-opacity="0" />
		</linearGradient>
	</defs>

	<g class="gust upper" stroke="url(#sakura-wind-color)">
		<path pathLength="100" d="M0 250 C233 259 299 140 528 155 S849 222 1035 165 S1288 96 1440 135" />
		<path class="wake" pathLength="100" d="M0 266 C225 272 326 161 526 174 S844 238 1039 184 S1283 114 1440 153" />
	</g>
	<g class="gust middle" stroke="url(#sakura-wind-color)">
		<path pathLength="100" d="M0 525 C202 423 321 500 490 481 S737 375 965 406 S1221 473 1440 358" />
		<path class="wake" pathLength="100" d="M0 547 C200 446 318 520 490 500 S734 396 965 426 S1222 494 1440 377" />
	</g>
	<g class="gust lower" stroke="url(#sakura-wind-color)">
		<path pathLength="100" d="M0 779 C169 696 360 746 548 730 S796 620 1003 655 S1276 694 1440 606" />
		<path class="wake" pathLength="100" d="M0 804 C172 716 356 767 550 751 S795 645 1002 677 S1278 716 1440 628" />
	</g>
</svg>

<style>
	.sakura-wind {
		position: absolute;
		inset: 0;
		z-index: 1;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	.upper { --duration: 14s; --phase: -5s; }
	.middle { --duration: 17s; --phase: -11s; }
	.lower { --duration: 12s; --phase: -2s; }

	.gust path {
		stroke-width: 1.25;
		stroke-linecap: round;
		vector-effect: non-scaling-stroke;
		stroke-dasharray: 30 100;
		animation: sail var(--duration) linear var(--phase) infinite;
	}

	.gust .wake {
		stroke-width: .75;
		stroke-dasharray: 17 113;
		opacity: .58;
		animation-delay: calc(var(--phase) + .55s);
	}

	@keyframes sail {
		from { stroke-dashoffset: 30; }
		to { stroke-dashoffset: -100; }
	}

	@media (max-width: 600px) {
		.middle { display: none; }
	}

	@media (prefers-reduced-motion: reduce) {
		.sakura-wind { display: none; }
	}
</style>
