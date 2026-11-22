// Run with playwright-cli run-code --filename=scripts/public-ui.playwright.js
// Open the local web app first with the seeded Games Day event open and upcoming.
async (page) => {
	const origin = new URL(page.url()).origin;
	const results = [];
	for (const [width, height] of [[1440, 900], [390, 844], [320, 740]]) {
		await page.setViewportSize({ width, height });
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await page.goto(origin);
		async function capture(step) {
			await page.evaluate(() => document.fonts.ready);
			const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
			if (overflow > 1) throw new Error(step + ' overflows by ' + overflow + 'px at ' + width);
			await page.screenshot({ path: 'test-results/program-first/' + width + '-' + step + '.png' });
		}
		await page.getByRole('heading', { level: 1 }).waitFor();
		await capture('home');
		const agenda = page.getByRole('region', { name: 'Upcoming events' });
		const jump = page.getByRole('link', { name: 'See the schedule' });
		await jump.focus();
		await page.keyboard.press('Enter');
		await page.waitForURL(url => url.hash === '#event');
		await agenda.locator('article').first().waitFor();
		if (!await agenda.evaluate(el => el === el.parentElement.firstElementChild)) throw new Error('Homepage agenda order');
		await capture('agenda');
		await agenda.getByRole('link', { name: 'View full schedule' }).click();
		await page.getByRole('heading', { name: 'Event schedule' }).waitFor();
		const firstAction = page.locator('.session-action').first();
		await firstAction.waitFor();
		const box = await firstAction.boundingBox();
		if (width === 390 && (!box || box.y < 0 || box.y + box.height > height)) throw new Error('First action below fold');
		await page.goto(origin);
		if (width < 600) {
			const toggle = page.getByRole('button', { name: 'Open navigation menu' });
			await toggle.click();
			const menu = page.getByRole('navigation', { name: 'Mobile navigation' });
			await menu.getByRole('link', { name: 'Events & Schedule' }).click();
			await menu.waitFor({ state: 'hidden' });
		} else {
			await page.getByRole('region', { name: 'Hero Introduction' })
				.getByRole('link', { name: 'Register for Events' }).click();
		}
		await page.getByRole('heading', { name: 'Event schedule' }).waitFor();
		const status = page.getByLabel('Registration status');
		await status.selectOption('all');
		await page.getByRole('button', { name: 'Apply filters' }).click();
		await page.waitForURL(url => url.searchParams.get('status') === 'all');
		await page.locator('.session').first().waitFor();
		await capture('schedule');
		await status.selectOption('open');
		await page.getByRole('button', { name: 'Apply filters' }).click();
		await page.waitForURL(url => url.searchParams.get('status') === 'open');
		const event = page.getByRole('link', { name: 'Games Day', exact: true });
		const title = (await event.innerText()).trim();
		await event.click();
		await page.getByRole('heading', { name: title, level: 1, exact: true }).waitFor();
		await capture('detail');
		const registration = page.getByRole('complementary', { name: 'Event Registration' });
		const heading = registration.getByRole('heading', { level: 2 });
		if (width < 600) {
			await page.getByRole('link', { name: /Go to registration/ }).click();
			await page.waitForURL(url => url.hash === '#registration');
			await page.waitForFunction(() => {
				const heading = document.querySelector('#registration h2').getBoundingClientRect();
				const header = document.querySelector('.site-nav').getBoundingClientRect();
				return heading.top >= header.bottom && heading.bottom <= innerHeight;
			});
		}
		if (!/register/i.test(await heading.innerText())) throw new Error('Missing registration action');
		const consent = page.getByRole('combobox', { name: 'Data privacy consent', exact: true });
		if (!await consent.evaluate(el => el.validity.valueMissing &&
			document.getElementById(el.getAttribute('aria-describedby'))?.textContent.includes('Data Privacy Act'))) {
			throw new Error('Consent disclosure or required response missing');
		}
		await capture('registration');
		await page.getByRole('navigation', { name: 'Breadcrumb' }).getByRole('link').click();
		await page.getByRole('heading', { name: 'Event schedule' }).waitFor();
		await page.locator('.session').filter({ has: event }).getByRole('link', { name: 'Register', exact: true }).click();
		await page.waitForURL(url => url.hash === '#registration');
		await page.waitForFunction(() => {
			const box = document.querySelector('#registration h2')?.getBoundingClientRect();
			return box && box.top >= document.querySelector('.site-nav').getBoundingClientRect().bottom && box.bottom <= innerHeight;
		});
		results.push({ width, event: title });
	}
	// Local schedule response fixture covers states that organizers can change.
	await page.route('**/events/__data.json*', route => route.fulfill({
		json: { type: 'data', nodes: [null, { type: 'data', data: [
			{ events: 1, status: 2, upcoming: 3 }, [4, 5], 'all', false,
			{ id: 6, title: 7, status: 8, startAt: 9, capacity: 10 },
			{ id: 11, title: 12, status: 13, startAt: 9, capacity: 10 },
			'fixture-closed', 'Closed session', 'closed', ['Date', '2027-01-10T01:00:00Z'], null,
			'fixture-external', 'Code Wars', 'open'
		], uses: {} }] }
	}));
	await page.goto(origin);
	await page.getByRole('region', { name: 'Upcoming events' }).getByRole('link', { name: 'View full schedule' }).click();
	const closed = page.getByRole('article').filter({ hasText: 'Closed session' });
	if (await closed.getByRole('link', { name: 'View details' }).getAttribute('href') !== '/events/fixture-closed') throw new Error('Closed destination');
	if (await page.getByRole('link', { name: 'Register at code-wars.dev' }).getAttribute('href') !== 'https://code-wars.dev/') throw new Error('External destination');
	await page.unroute('**/events/__data.json*');
	return results;
}
