import { error } from '@sveltejs/kit';

import { PUBLIC_STRAPI_API_URL } from '$env/static/public';

import type { SiteSchema } from '^types';
import { type DbSchema, endPoint } from '^db';
import { deepValidate as validateDbData } from '^db/portfolio';
import { compareByOrderThenId, transformDbDataToSiteSchema } from '^utils/portfolio';

export async function load() {
	const pagesDbRes = await fetch(PUBLIC_STRAPI_API_URL + endPoint.portfolio);

	if (!pagesDbRes.ok) {
		throw error(pagesDbRes.status, `Failed to fetch portfolio entities: ${pagesDbRes.statusText}`);
	}

	const pagesDb: DbSchema['Portfolio'][] = await pagesDbRes.json();

	const pagesProcessed: SiteSchema['Portfolio'][] = pagesDb
		.filter(validateDbData)
		.map(transformDbDataToSiteSchema)
		.sort(compareByOrderThenId);

	return { page: pagesProcessed };
}

export const prerender = true;
