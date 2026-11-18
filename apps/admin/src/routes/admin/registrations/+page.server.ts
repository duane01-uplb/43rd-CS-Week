import { requireAdmin } from '$lib/server/auth-guards';
import { listRegistrations } from '$lib/server/registration-list';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	await requireAdmin(event);
	return listRegistrations(event.url);
};
