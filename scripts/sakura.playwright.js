// Open the revision homepage, then use playwright-cli run-code --filename=scripts/sakura.playwright.js.
async page => {
	const origin = new URL(page.url()).origin;
	const results = [];
	for (const width of [1440, 1024, 768, 390, 320]) {
		await page.setViewportSize({width, height:width === 1440 ? 900 : 844});
		await page.emulateMedia({reducedMotion:'no-preference'});
		await page.goto(origin);
		await page.waitForFunction(() => document.querySelector('.journal').style.getPropertyValue('--drift') !== '');
		await page.evaluate(() => scrollTo({top:0, behavior:'instant'}));
		await page.evaluate(() => document.fonts.ready);
		await page.locator('.hero-photo img').evaluate(img => img.decode());
		await page.screenshot({path:'test-results/sakura/arrival-'+width+'.png'});
		if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw Error('Overflow at '+width);
		const primary = await page.getByRole('link',{name:'View event schedule'}).boundingBox();
		if (!primary || primary.y + primary.height > page.viewportSize().height) throw Error('Schedule below fold');
		if (width >= 960) {
			const branch = await page.locator('.spine svg').boundingBox();
			if (!branch || Math.abs(branch.x + branch.width/2 - width/2) > 2) throw Error('Branch is off center');
		}
		const active = page.locator(width >= 960 ? '.spine .branch' : '#program .mobile-branch .branch');
		const ink = active.locator('mask path');
		const initialInk = Number(await ink.getAttribute('stroke-dashoffset'));
		const initialPose = await active.locator('.bough').getAttribute('transform');
		await page.locator('#program').evaluate(el => el.scrollIntoView({block:'start', behavior:'instant'}));
		await page.waitForFunction(({selector, start}) => Number(document.querySelector(selector).getAttribute('stroke-dashoffset')) < start,
			{selector:(width >= 960 ? '.spine' : '#program .mobile-branch')+' mask path', start:initialInk});
		if (Number(await ink.getAttribute('stroke-dashoffset')) >= initialInk ||
			await active.locator('.bough').getAttribute('transform') === initialPose) throw Error('Branch does not grow and turn at '+width);
		if (width >= 960) {
			const crowded = await page.locator('.spread').evaluateAll(rows => {
				const branch = document.querySelector('.spine svg').getBoundingClientRect();
				return rows.some(row => Array.from(row.children).some(el => {
					const r = el.getBoundingClientRect();
					return r.left < branch.right - 1 && r.right > branch.left + 1;
				}));
			});
			if (crowded) throw Error('Branch gutter overlaps program content at '+width);
		}
		if (await active.evaluate(el => getComputedStyle(el).pointerEvents !== 'none' || el.getAttribute('aria-hidden') !== 'true')) throw Error('Decorative branch intercepts interaction');
		await page.screenshot({path:'test-results/sakura/program-'+width+'.png'});
		await page.locator('#seasons').scrollIntoViewIfNeeded();
		const note = page.getByRole('button',{name:'Blossom note'});
		await note.focus();
		await page.keyboard.press('Enter');
		await page.getByText('A notch at the tip', {exact:false}).waitFor();
		for (const season of ['Summer','Autumn','Winter','Spring']) {
			const control = page.getByRole('button',{name:season,exact:true});
			await control.click();
			if (await control.getAttribute('aria-pressed') !== 'true') throw Error('Season selection: '+season);
			await page.getByAltText('A pavilion and garden pond in '+season.toLowerCase()).evaluate(img=>img.decode());
		}
		await page.evaluate(() => window.scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'}));
		await page.waitForFunction(() => Number(document.querySelector('.closing-branch mask path').getAttribute('stroke-dashoffset')) < .01);
		await page.screenshot({path:'test-results/sakura/participate-'+width+'.png'});
		await page.getByRole('button',{name:'Replay the bloom'}).click();
		await page.waitForFunction(() => scrollY === 0);
		if (Math.abs(Number(await ink.getAttribute('stroke-dashoffset')) - initialInk) > .02) throw Error('Replay did not reset growth');
		await page.emulateMedia({reducedMotion:'reduce'});
		await page.waitForFunction(() => getComputedStyle(document.querySelector('.sun')).animationName === 'none');
		if (await active.locator('.cluster').first().evaluate(el => getComputedStyle(el).animationName !== 'none')) throw Error('Blossom motion under reduced motion');
		results.push(width);
	}
	await page.goto(origin+'/cs-week?render=full#how-it-works');
	await page.waitForURL(url => url.pathname==='/' && url.searchParams.get('render')==='full' && url.hash==='#how-it-works');
	for (const [summary, message] of [
		[[{summary:1}, {upcoming:2,programEvents:2}, []], 'No upcoming events are open for registration.'],
		[[{summary:1}, null], 'Upcoming events couldn’t load.']
	]) {
		await page.goto(origin+'/events');
		await page.route('**/__data.json*', route => route.fulfill({
			json:{type:'data', nodes:[null,{type:'data',data:summary,uses:{}}]}
		}));
		await page.getByRole('link',{name:'CASC4D3 home'}).click();
		await page.getByText(message,{exact:true}).waitFor();
		await page.getByRole('link',{name:'View full schedule'}).waitFor();
		await page.unroute('**/__data.json*');
	}
	return results;
}
