import { error } from '@sveltejs/kit';

import { PUBLIC_STRAPI_API_URL } from '$env/static/public';

import { type DbSchema, endPoint } from '^db';
import { sanitiseProduct } from '^db/product';

export async function load() {
	if (!PUBLIC_STRAPI_API_URL) {
		throw error(500, 'Configuration error: STRAPI API URL is missing');
	}

	const productsRes = await fetch(PUBLIC_STRAPI_API_URL + endPoint.products);

	if (!productsRes.ok) {
		throw error(productsRes.status, `Failed to fetch products entities: ${productsRes.statusText}`);
	}

	const productsRaw: DbSchema['ProductRaw'][] = await productsRes.json();

	const productsDb = productsRaw
		.map(sanitiseProduct)
		.filter((p): p is DbSchema['ProductProcessed'] => p !== null);

	const productsDbMap = new Map(productsDb.map((p) => [p.shopifyId, p]));

	return { productsDb: { array: productsDb, map: productsDbMap } };
}

export const prerender = true;
