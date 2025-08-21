import { error } from '@sveltejs/kit';

import { PUBLIC_STRAPI_API_URL } from '$env/static/public';

import type { SiteSchema } from '^types';
import { type DbSchema, endPoint } from '^db';
import { sanitisePortfolio } from '^db/portfolio';
import { compareByOrderThenId, mapPortfolioToSite } from '^utils/portfolio';

export async function load() {
	if (!PUBLIC_STRAPI_API_URL) {
		throw error(500, 'Configuration error: STRAPI API URL is missing');
	}

	const portfolioRes = await fetch(PUBLIC_STRAPI_API_URL + endPoint.portfolio);

	if (!portfolioRes.ok) {
		throw error(
			portfolioRes.status,
			`Failed to fetch portfolio entities: ${portfolioRes.statusText}`
		);
	}

	const portfoliosRaw: DbSchema['Portfolio'][] = await portfolioRes.json();

	const portfolios: SiteSchema['Portfolio'][] = portfoliosRaw
		.map(sanitisePortfolio)
		.filter((p): p is DbSchema['Portfolio'] => p !== null)
		.map(mapPortfolioToSite)
		.sort(compareByOrderThenId);

	return { portfolios };
}

export const prerender = true;
