import { createStorefrontApiClient, type ClientResponse } from '@shopify/storefront-api-client';

import { PUBLIC_SHOPIFY_STORE_DOMAIN, PUBLIC_SHOPIFY_STOREFRONT_TOKEN } from '$env/static/public';

import { getProducts as getProductsGql, type ProductQueryRes } from '^helpers/shopify';
import type { Shopify } from '^lib/types';
import { purifyProduct, sanitiseProduct as sanitiseProductShopify } from '^shopify/product';
import { sanitiseProduct as sanitiseProductDb } from '^db/product';
import { mapToSite } from '^utils/product-shopify';
import { PUBLIC_STRAPI_API_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';
import { endPoint, type DbSchema } from '^db';

async function fetchProductsShopify() {
	try {
		const client = createStorefrontApiClient({
			storeDomain: PUBLIC_SHOPIFY_STORE_DOMAIN,
			apiVersion: '2025-07',
			publicAccessToken: PUBLIC_SHOPIFY_STOREFRONT_TOKEN
		});

		const res: ClientResponse<ProductQueryRes> = await client.request(getProductsGql, {
			variables: { first: 250 }
		});

		if (res.errors) {
			throw new Error(`Product request error: ${JSON.stringify(res.errors)}`);
		}

		if (!res.data) {
			throw new Error('No data received from Shopify API');
		}

		if (!res.data.products || !res.data.products.edges) {
			throw new Error('Invalid products data structure received');
		}

		const productsRaw = res.data.products.edges.map((edge) => edge.node);

		const products = productsRaw
			.map(sanitiseProductShopify)
			.filter((p): p is Shopify['Product'] => p !== null)
			.map(purifyProduct)
			.map(mapToSite);

		return products;
	} catch (error) {
		console.error('fetchProducts error', { error, timestamp: new Date().toISOString() });
	}
}

async function fetchProductsDb() {
	try {
		if (!PUBLIC_STRAPI_API_URL) {
			throw error(500, 'Configuration error: STRAPI API URL is missing');
		}

		const productsRes = await fetch(PUBLIC_STRAPI_API_URL + endPoint.products);

		if (!productsRes.ok) {
			throw error(
				productsRes.status,
				`Failed to fetch products entities: ${productsRes.statusText}`
			);
		}

		const productsRaw: DbSchema['ProductRaw'][] = await productsRes.json();

		const productsDb = productsRaw
			.map(sanitiseProductDb)
			.filter((p): p is DbSchema['ProductProcessed'] => p !== null);

		return productsDb;
	} catch (error) {
		console.error('fetchProducts error', { error, timestamp: new Date().toISOString() });
	}
}

export async function load({ params }) {
	const productsShopify = await fetchProductsShopify();
	const productsDb = await fetchProductsDb();

	if (!productsShopify || !productsDb) {
		throw Error(`Failed to fetch products entities`);
	}

	const productsDbMap = new Map(productsDb.map((p) => [p.shopifyId.split('/').pop(), p]));

	const productsShopifyValid = productsShopify.filter((productShopify) =>
		productsDbMap.has(productShopify.id)
	);

	// const productsShopifyValidMap = new Map(productsShopifyValid.map((p) => [p.id, p]));

	if (!productsShopify.map((p) => p.id.split('/').pop()).includes(params.slug)) {
		throw error(404, 'Not found');
	}

	return {
		shopify: productsShopifyValid.find((p) => p.id.split('/').pop() === params.slug)!,
		db: productsDbMap.get(params.slug)!
	};
}

export async function entries() {
	const productsShopify = await fetchProductsShopify();
	const productsDb = await fetchProductsDb();

	if (!productsShopify || !productsDb) {
		throw Error(`Failed to fetch products entities`);
	}

	const productsDbMap = new Map(productsDb.map((p) => [p.shopifyId, p]));

	const productsShopifyValid = productsShopify.filter((productShopify) =>
		productsDbMap.has(productShopify.id)
	);

	return productsShopifyValid.map((product) => ({
		slug: `${product.id.split('/').pop()}`
	}));
}

export const prerender = true;
