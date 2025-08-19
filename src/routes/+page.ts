import { PUBLIC_STRAPI_API_URL } from '$env/static/public';

import { endPoint } from '^constants/db';
import type { Db } from '^types';

import { processDataForSite, remapDataDb, sanitiseDataDb } from '^lib/db-utils/portfolio';

export async function load() {
	const res = await fetch(PUBLIC_STRAPI_API_URL + endPoint['portfolio-pages']);
	const pagesDb: Db['PortfolioPage'][] = await res.json();

	const pagesDbSanitised = sanitiseDataDb(pagesDb);
	const pagesDbRemapped = pagesDbSanitised.map(remapDataDb);
	const pagesSite = processDataForSite(pagesDbRemapped);

	return { page: pagesSite };
}

export const prerender = true;
