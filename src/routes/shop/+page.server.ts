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

	const productsRaw: DbSchema['Product'][] = await productsRes.json();

	const productsDb = productsRaw
		.map(sanitiseProduct)
		.filter((p): p is DbSchema['Product'] => p !== null);

	return { productsDb };
}

export const prerender = true;
