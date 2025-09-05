import {
	createStorefrontApiClient,
	type ClientResponse,
	type StorefrontApiClient
} from '@shopify/storefront-api-client';

import { PUBLIC_SHOPIFY_STORE_DOMAIN, PUBLIC_SHOPIFY_STOREFRONT_TOKEN } from '$env/static/public';

import {
	cartAddProduct as cartAddProductGql,
	cartCreate as cartCreateGql,
	getProducts as getProductsGql,
	type CartCreateRes,
	type ProductQueryRes
} from '^helpers/shopify';
import type { Shopify, SiteSchema } from '^lib/types';
import { purifyProduct, sanitiseProduct } from '^shopify/product';
import { mapToSite } from '^utils/product-shopify';

interface ShopifyState {
	client: StorefrontApiClient | null;
	cart: Shopify['Cart'] | null;
	products: SiteSchema['ProductShopify'][] | null;
	initialized: boolean;
	fetchProductsStatus: 'idle' | 'pending' | 'error' | 'success';
}

export const shopifyState = $state<ShopifyState>({
	client: null,
	cart: null,
	products: null,
	initialized: false,
	fetchProductsStatus: 'idle'
});

export const shopifyHelper = {
	initializeClient,
	products: {
		fetch: fetchProducts
	},
	cart: {
		create: cartCreate,
		addProduct: cartAddProduct
	}
};

function initializeClient() {
	if (shopifyState.initialized) {
		console.warn('Shopify Client already initialised');
		return;
	}

	shopifyState.client = createStorefrontApiClient({
		storeDomain: PUBLIC_SHOPIFY_STORE_DOMAIN,
		apiVersion: '2025-07',
		// publicAccessToken: 'fail'
		publicAccessToken: PUBLIC_SHOPIFY_STOREFRONT_TOKEN
	});
}

async function fetchProducts() {
	try {
		shopifyState.fetchProductsStatus = 'pending';

		if (!shopifyState.client) {
			initializeClient();
		}

		// createStorefontApiClient always returns an object
		const res: ClientResponse<ProductQueryRes> = await shopifyState.client!.request(
			getProductsGql,
			{
				variables: { first: 250 }
			}
		);

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
			.map(sanitiseProduct)
			.filter((p): p is Shopify['Product'] => p !== null)
			.map(purifyProduct)
			.map(mapToSite);

		shopifyState.fetchProductsStatus = 'success';

		shopifyState.products = products;

		return products;
	} catch (error) {
		shopifyState.fetchProductsStatus = 'error';

		console.error('fetchProducts error', { error, timestamp: new Date().toISOString() });
	}
}

async function cartCreate() {
	if (!shopifyState.client) {
		console.error('Storefront client not initialized', {
			timestamp: new Date().toISOString()
		});
		throw new Error('Storefront client not initialized');
	}

	const res: ClientResponse<CartCreateRes> = await shopifyState.client.request(cartCreateGql, {
		variables: { input: {} }
	});

	if (res.data) {
		shopifyState.cart = res.data.cartCreate.cart;
	}
}

async function cartAddProduct(cartId: string, merchandiseId: string, quantity: number = 1) {
	if (!shopifyState.client) {
		console.error('Storefront client not initialized');
		return;
	}

	const res = await shopifyState.client.request(cartAddProductGql, {
		variables: {
			cartId,
			lines: { merchandiseId, quantity }
		}
	});

	if (res.data) {
		shopifyState.cart = res.data.cartLinesAdd.cart;
	}
}
