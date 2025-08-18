import { PUBLIC_STRAPI_API_URL } from '$env/static/public';

import { endPoint } from '^constants/db.js';
import type { Db } from '^types';

export async function load() {
	const res = await fetch(PUBLIC_STRAPI_API_URL + endPoint['portfolio-pages']);
	const pagesFromDb: Db['PortfolioPage'][] = await res.json();

	return { page: pagesFromDb };
}

export const prerender = true;
