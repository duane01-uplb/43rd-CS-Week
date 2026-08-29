<script lang="ts">
	import Badge from '$lib/components/Badge.svelte';
	import Button from '$lib/components/Button.svelte';

	let { data, form } = $props();

	const formatDateTime = (date: Date) =>
		new Intl.DateTimeFormat('en-PH', {
			dateStyle: 'full',
			timeStyle: 'short',
			timeZone: 'Asia/Manila'
		}).format(new Date(date));

	let isSubmitting = $state(false);
</script>

<svelte:head>
	<title>{data.event.title} | CASC4D3</title>
	<meta
		name="description"
		content={`Register for ${data.event.title} at the 43rd Computer Science Week. Free admission.`}
	/>
</svelte:head>

<div class="event-detail-page">
	<!-- Breadcrumb Navigation -->
	<nav class="detail-nav" aria-label="Breadcrumb">
		<a href="/events" class="arrow-back">
			<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<path d="m15 18-6-6 6-6" />
			</svg>
			<span>Back to all events</span>
		</a>
	</nav>

	<!-- Main 2-column layout -->
	<div class="detail-grid">
		<!-- Left: Event Information -->
		<div class="detail-info">
			<header class="detail-header">
				<div class="header-badges">
					<span class="eyebrow-pill">43RD CS WEEK</span>
					{#if data.event.status === 'open'}
						<Badge variant="open">Open for registration</Badge>
					{:else if data.event.status === 'closed'}
						<Badge variant="closed">Registration closed</Badge>
					{:else}
						<Badge variant="draft">Draft / Announced</Badge>
					{/if}
				</div>

				<h1>{data.event.title}</h1>
			</header>

			<!-- Quick Info Strip -->
			<div class="info-strip">
				<div class="info-tile">
					<span class="info-icon" aria-hidden="true">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<rect x="3" y="4" width="18" height="18" rx="2" />
							<path d="M3 10h18" />
							<path d="M8 2v4M16 2v4" />
						</svg>
					</span>
					<div class="info-text">
						<span class="info-label">Date & Time</span>
						<span class="info-val">{formatDateTime(data.event.startAt)}</span>
					</div>
				</div>

				<div class="info-tile">
					<span class="info-icon" aria-hidden="true">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
							<circle cx="9" cy="7" r="4" />
							<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
							<path d="M16 3.13a4 4 0 0 1 0 7.75" />
						</svg>
					</span>
					<div class="info-text">
						<span class="info-label">Capacity</span>
						<span class="info-val">
							{#if data.event.capacity !== null}
								{data.event.capacity} participants maximum
							{:else}
								Open / Unlimited capacity
							{/if}
						</span>
					</div>
				</div>

				<div class="info-tile">
					<span class="info-icon" aria-hidden="true">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<circle cx="12" cy="12" r="10" />
							<path d="m9 12 2 2 4-4" />
						</svg>
					</span>
					<div class="info-text">
						<span class="info-label">Admission</span>
						<span class="info-val val-free">100% Free · No Payment</span>
					</div>
				</div>
			</div>

			<!-- Event Overview & Description -->
			<section class="description-card" aria-labelledby="about-event-heading">
				<h2 id="about-event-heading">About this event</h2>
				<div class="description-body">
					{#if data.event.description}
						<p>{data.event.description}</p>
					{:else}
						<p>Further guidelines, schedule details, and mechanics will be shared prior to the session.</p>
					{/if}
				</div>
			</section>

			<!-- Participation notes -->
			<section class="notes-card" aria-label="Participation guidelines">
				<h3>Important Information</h3>
				<ul class="notes-list">
					<li>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
						</svg>
						<span><strong>Data Privacy:</strong> Information provided is collected solely for event administration and verification under RA 10173.</span>
					</li>
					<li>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<circle cx="12" cy="12" r="10" />
							<path d="M12 8v4l3 3" />
						</svg>
						<span><strong>Timezone:</strong> All event times are displayed in Philippine Standard Time (PST / Asia/Manila).</span>
					</li>
				</ul>
			</section>
		</div>

		<!-- Right: Registration Form / Status Panel -->
		<aside class="detail-action-col" aria-label="Event Registration">
			<div class="registration-card">
				{#if form?.success}
					<div class="success-state" role="status">
						<div class="success-icon" aria-hidden="true">
							<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
								<path d="M20 6 9 17l-5-5" />
							</svg>
						</div>
						<h2>You're registered!</h2>
						<p class="success-lede">
							Your registration for <strong>{data.event.title}</strong> has been received and confirmed.
						</p>
						<div class="success-details">
							<p>We look forward to seeing you at the event. Keep an eye out for updates and announcements from the organizers.</p>
						</div>
						<div class="success-actions">
							<Button variant="primary" size="md" fullWidth href="/events">Browse other events</Button>
						</div>
					</div>
				{:else if data.event.status !== 'open'}
					<div class="closed-state">
						<div class="closed-icon" aria-hidden="true">
							<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<circle cx="12" cy="12" r="10" />
								<line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
							</svg>
						</div>
						<h2>Registration Unavailable</h2>
						<p>
							{#if data.event.status === 'closed'}
								Registration for this event is currently closed or capacity has been reached.
							{:else}
								This event has been announced but is not yet open for registration. Check back soon!
							{/if}
						</p>
						<div style="margin-top: 1.25rem;">
							<Button variant="ghost" size="md" fullWidth href="/events">View available events</Button>
						</div>
					</div>
				{:else}
					<div class="form-header">
						<h2>Register for Free</h2>
						<p class="form-subtitle">Complete the fields below to secure your spot. No account required.</p>
					</div>

					{#if form?.error}
						<div class="status-msg alert" role="alert">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								<circle cx="12" cy="12" r="10" />
								<line x1="12" y1="8" x2="12" y2="12" />
								<line x1="12" y1="16" x2="12.01" y2="16" />
							</svg>
							<span>{form.error}</span>
						</div>
					{/if}

					<form
						method="POST"
						action="?/register"
						enctype="multipart/form-data"
						class="reg-form"
						onsubmit={() => (isSubmitting = true)}
					>
						{#each data.fields as field (field.id)}
							<div class="field" class:field-checkbox={field.fieldType === 'checkbox'}>
								{#if field.fieldType === 'checkbox'}
									<label class="custom-checkbox-label">
										<input
											id={`field-${field.fieldKey}`}
											name={field.fieldKey}
											type="checkbox"
											required={field.isRequired}
										/>
										<span class="custom-checkbox-box" aria-hidden="true"></span>
										<span class="checkbox-text">
											{field.label}
											{#if field.isRequired}<span class="req-star" aria-hidden="true">*</span>{/if}
										</span>
									</label>
								{:else if field.fieldType === 'select'}
									<label for={`field-${field.fieldKey}`}>
										{field.label}
										{#if field.isRequired}<span class="req-star" aria-hidden="true">*</span>{/if}
									</label>
									<div class="select-wrapper">
										<select
											id={`field-${field.fieldKey}`}
											name={field.fieldKey}
											required={field.isRequired}
										>
											<option value="">Please select an option</option>
											{#each (field.options as string[] ?? []) as option}
												<option value={option}>{option}</option>
											{/each}
										</select>
										<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="select-icon" aria-hidden="true">
											<path d="m6 9 6 6 6-6" />
										</svg>
									</div>
								{:else if field.fieldType === 'file'}
									<label for={`field-${field.fieldKey}`}>
										{field.label}
										{#if field.isRequired}<span class="req-star" aria-hidden="true">*</span>{/if}
									</label>
									<div class="file-upload-card">
										<input
											id={`field-${field.fieldKey}`}
											name={field.fieldKey}
											type="file"
											accept="image/*"
											required={field.isRequired}
											class="file-input"
										/>
										<div class="file-hint">
											<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
												<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
												<polyline points="17 8 12 3 7 8" />
												<line x1="12" y1="3" x2="12" y2="15" />
											</svg>
											<span>Supported: PNG, JPG, WebP, or HEIC (up to 4 MB)</span>
										</div>
									</div>
								{:else}
									<label for={`field-${field.fieldKey}`}>
										{field.label}
										{#if field.isRequired}<span class="req-star" aria-hidden="true">*</span>{/if}
									</label>
									<input
										id={`field-${field.fieldKey}`}
										name={field.fieldKey}
										type={field.fieldType}
										required={field.isRequired}
										placeholder={field.fieldType === 'email' ? 'e.g. name@up.edu.ph' : ''}
									/>
								{/if}
							</div>
						{/each}

						<div class="form-submit">
							<Button type="submit" variant="primary" size="lg" fullWidth disabled={isSubmitting}>
								{#if isSubmitting}
									<span>Submitting registration...</span>
								{:else}
									<span>Complete registration</span>
									<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
										<path d="M5 12h14" />
										<path d="m12 5 7 7-7 7" />
									</svg>
								{/if}
							</Button>
						</div>

						<p class="privacy-note">
							By submitting, you agree to participate and allow CS Week organizers to process your details for event logistics.
						</p>
					</form>
				{/if}
			</div>
		</aside>
	</div>
</div>

<style>
	.event-detail-page {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.detail-nav {
		margin-bottom: 0.5rem;
	}
	.arrow-back {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		color: var(--plum-soft);
		font-size: 0.92rem;
		font-weight: 600;
		transition: color 0.15s ease, transform 0.15s ease;
	}
	.arrow-back:hover {
		color: var(--rose-700);
		text-decoration: none;
		transform: translateX(-2px);
	}

	/* Two-column layout */
	.detail-grid {
		display: grid;
		grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);
		align-items: start;
		gap: clamp(2rem, 5vw, 3.5rem);
	}

	/* Left Column */
	.detail-info {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.header-badges {
		display: flex;
		align-items: center;
		gap: 0.65rem;
		margin-bottom: 1rem;
		flex-wrap: wrap;
	}
	.eyebrow-pill {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		padding: 0.2rem 0.65rem;
		background: var(--rose-100);
		color: var(--rose-900);
		border-radius: 999px;
	}

	.detail-header h1 {
		font-size: clamp(2.2rem, 5vw, 3.2rem);
		line-height: 1.15;
		margin: 0;
	}

	/* Quick Info Strip */
	.info-strip {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		background: var(--card);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		padding: 1.25rem 1.5rem;
		box-shadow: var(--shadow);
	}
	.info-tile {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.5rem 0;
	}
	.info-tile:not(:last-child) {
		border-bottom: 1px solid var(--line);
		padding-bottom: 0.75rem;
	}
	.info-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 38px;
		height: 38px;
		border-radius: 10px;
		background: var(--rose-100);
		color: var(--rose-700);
		flex-shrink: 0;
	}
	.info-text {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}
	.info-label {
		font-size: 0.74rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--plum-soft);
		font-weight: 600;
	}
	.info-val {
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--plum);
	}
	.val-free {
		color: var(--ok);
	}

	/* Description Card */
	.description-card {
		background: var(--card);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		padding: 2rem 1.75rem;
		box-shadow: var(--shadow);
	}
	.description-card h2 {
		font-size: 1.35rem;
		margin: 0 0 1rem;
	}
	.description-body p {
		margin: 0;
		color: var(--plum);
		font-size: 1rem;
		line-height: 1.7;
	}

	/* Notes Card */
	.notes-card {
		background: var(--rose-050);
		border: 1px solid var(--rose-100);
		border-radius: var(--radius);
		padding: 1.5rem 1.75rem;
	}
	.notes-card h3 {
		font-size: 1.1rem;
		margin: 0 0 0.85rem;
		color: var(--rose-900);
	}
	.notes-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
	}
	.notes-list li {
		display: flex;
		align-items: flex-start;
		gap: 0.65rem;
		font-size: 0.88rem;
		line-height: 1.5;
		color: var(--plum);
	}
	.notes-list li svg {
		color: var(--rose-700);
		flex-shrink: 0;
		margin-top: 0.15rem;
	}

	/* Right Column - Registration Card */
	.registration-card {
		background: var(--card);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		padding: clamp(1.75rem, 4vw, 2.25rem);
		box-shadow: var(--shadow);
		position: sticky;
		top: 88px;
	}

	.form-header {
		margin-bottom: 1.5rem;
		border-bottom: 1px solid var(--line);
		padding-bottom: 1rem;
	}
	.form-header h2 {
		font-size: 1.4rem;
		margin: 0 0 0.35rem;
	}
	.form-subtitle {
		margin: 0;
		color: var(--plum-soft);
		font-size: 0.9rem;
	}

	.reg-form {
		display: flex;
		flex-direction: column;
	}
	.req-star {
		color: var(--rose-700);
		margin-left: 0.2rem;
	}

	.select-wrapper {
		position: relative;
		display: flex;
		align-items: center;
	}
	.select-wrapper select {
		appearance: none;
		-webkit-appearance: none;
		padding-right: 2.25rem;
		cursor: pointer;
	}
	.select-icon {
		position: absolute;
		right: 0.85rem;
		pointer-events: none;
		color: var(--plum-soft);
	}

	/* Custom Checkbox */
	.custom-checkbox-label {
		display: flex;
		align-items: flex-start;
		gap: 0.65rem;
		cursor: pointer;
		user-select: none;
	}
	.custom-checkbox-label input {
		accent-color: var(--rose-700);
		width: 18px;
		height: 18px;
		margin-top: 0.15rem;
		cursor: pointer;
	}
	.checkbox-text {
		font-size: 0.92rem;
		font-weight: 500;
		color: var(--plum);
		line-height: 1.4;
	}

	/* File Upload Box */
	.file-upload-card {
		background: var(--paper);
		border: 1.5px dashed var(--rose-100);
		border-radius: var(--radius-sm);
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	.file-input {
		font-size: 0.88rem;
		color: var(--plum);
		cursor: pointer;
	}
	.file-hint {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.8rem;
		color: var(--plum-soft);
	}
	.file-hint svg {
		color: var(--rose-600);
	}

	.form-submit {
		margin-top: 0.75rem;
		margin-bottom: 1rem;
	}

	.privacy-note {
		margin: 0;
		font-size: 0.78rem;
		color: var(--plum-soft);
		line-height: 1.5;
		text-align: center;
	}

	/* Success & Closed States */
	.success-state,
	.closed-state {
		text-align: center;
		padding: 1.5rem 0.5rem;
	}
	.success-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 64px;
		height: 64px;
		border-radius: 50%;
		background: #e5f2eb;
		color: var(--ok);
		margin-bottom: 1.25rem;
	}
	.success-state h2 {
		font-size: 1.6rem;
		margin: 0 0 0.5rem;
		color: var(--plum);
	}
	.success-lede {
		color: var(--plum);
		font-size: 1rem;
		margin: 0 0 1.25rem;
		line-height: 1.6;
	}
	.success-details {
		background: var(--rose-050);
		border: 1px solid var(--rose-100);
		border-radius: var(--radius-sm);
		padding: 1rem 1.25rem;
		margin-bottom: 1.5rem;
		text-align: left;
	}
	.success-details p {
		margin: 0;
		font-size: 0.9rem;
		color: var(--plum-soft);
		line-height: 1.5;
	}

	.closed-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: var(--rose-100);
		color: var(--rose-700);
		margin-bottom: 1.25rem;
	}
	.closed-state h2 {
		font-size: 1.4rem;
		margin: 0 0 0.5rem;
	}
	.closed-state p {
		color: var(--plum-soft);
		font-size: 0.95rem;
		line-height: 1.6;
		margin: 0;
	}

	/* Responsive */
	@media (max-width: 900px) {
		.detail-grid {
			grid-template-columns: 1fr;
		}
		.registration-card {
			position: static;
		}
	}
</style>
