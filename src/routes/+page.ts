import { PUBLIC_STRAPI_API_URL } from '$env/static/public';

import { endPoint } from '^constants/db';
import type { Db } from '^types';

import { sanitiseDataDb } from '^lib/db-utils/portfolio';

export async function load() {
	const res = await fetch(PUBLIC_STRAPI_API_URL + endPoint['portfolio-pages']);
	const pagesDb: Db['PortfolioPage'][] = await res.json();

	const sanitisedDataDb = sanitiseDataDb(pagesDb);

	return { page: pagesDb };
}

export const prerender = true;
