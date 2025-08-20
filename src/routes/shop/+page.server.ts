import { error } from '@sveltejs/kit';

import { PUBLIC_STRAPI_API_URL } from '$env/static/public';

// import type { SiteSchema } from '^types';
import { type DbSchema, endPoint } from '^db';
// import { validate as validateDbData } from '^db/portfolio';
// import { compareByOrderThenId, transformDbDataToSiteSchema } from '^utils/portfolio';

export async function load() {
	const pagesDbRes = await fetch(PUBLIC_STRAPI_API_URL + endPoint.products);

	if (!pagesDbRes.ok) {
		throw error(pagesDbRes.status, `Failed to fetch products: ${pagesDbRes.statusText}`);
	}

	const productsDb: DbSchema['Product'][] = await pagesDbRes.json();

	return { page: productsDb };
}

export const prerender = true;
