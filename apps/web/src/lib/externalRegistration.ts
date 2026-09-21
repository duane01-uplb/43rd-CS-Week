/** Events whose registration lives on an external site, not this form. */
const EXTERNAL_REGISTRATION: Record<string, { url: string; hostLabel: string }> = {
	'code wars': {
		url: 'https://code-wars.dev/',
		hostLabel: 'code-wars.dev'
	}
};

export function getExternalRegistration(title: string) {
	return EXTERNAL_REGISTRATION[title.trim().toLowerCase()] ?? null;
}
