// Open the revision homepage, then use playwright-cli run-code --filename=scripts/sakura.playwright.js.
async page => {
	const origin = new URL(page.url()).origin;
	const results = [];
	for (const width of [1440, 768, 390, 320]) {
		await page.setViewportSize({width, height:width === 1440 ? 900 : 844});
		await page.emulateMedia({reducedMotion:'no-preference'});
		await page.goto(origin);
		await page.evaluate(() => document.fonts.ready);
		await page.locator('.hero-photo img').evaluate(img => img.decode());
		await page.screenshot({path:'test-results/sakura/arrival-'+width+'.png'});
		if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw Error('Overflow at '+width);
		await page.getByRole('link',{name:'Begin the journey'}).click();
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
		await page.waitForFunction(() => Number(document.querySelector('.branch > path').getAttribute('stroke-dashoffset')) < .01);
		await page.getByRole('button',{name:'Replay the journey'}).click();
		await page.waitForFunction(() => scrollY === 0);
		await page.emulateMedia({reducedMotion:'reduce'});
		await page.waitForFunction(() => getComputedStyle(document.querySelector('.fall')).display === 'none');
		results.push(width);
	}
	await page.getByRole('link',{name:'CS Week',exact:false}).first().click();
	await page.waitForURL('**/cs-week');
	await page.getByRole('heading',{level:1}).waitFor();
	return results;
}
