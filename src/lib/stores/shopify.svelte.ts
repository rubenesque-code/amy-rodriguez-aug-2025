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
import type { Shopify } from '^lib/types';

interface ShopifyState {
	client: StorefrontApiClient | null;
	cart: Shopify['Cart'] | null;
	products: Shopify['Product'][] | null;
	initialized: boolean;
}

export const shopifyState = $state<ShopifyState>({
	client: null,
	cart: null,
	products: null,
	initialized: false
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
	if (!shopifyState.initialized) {
		try {
			shopifyState.client = createStorefrontApiClient({
				storeDomain: PUBLIC_SHOPIFY_STORE_DOMAIN,
				apiVersion: '2025-07',
				publicAccessToken: PUBLIC_SHOPIFY_STOREFRONT_TOKEN
			});

			if (!shopifyState.client) {
				throw new Error('Shopify Client Init Error');
			}
		} catch (error) {
			console.error('Failed to init Shopify client:', {
				error,
				timestamp: new Date().toISOString()
			});
		}
	}
}

async function fetchProducts() {
	try {
		if (!shopifyState.client) {
			initializeClient();
		}

		if (!shopifyState.client) {
			throw new Error('Shopify Client Init Error');
		}

		const res: ClientResponse<ProductQueryRes> = await shopifyState.client.request(getProductsGql, {
			variables: { first: 250 }
		});

		if (res.errors) {
			console.error('GraphQLErrors', {
				errors: res.errors
			});
			throw new Error(`GraphQL errors: ${res.errors}`);
		}

		if (!res.data) {
			throw new Error('No data received from Shopify API');
		}

		if (!res.data.products || !res.data.products.edges) {
			throw new Error('Invalid products data structure received');
		}

		shopifyState.products = res.data.products.edges.map((edge) => edge.node);

		// return shopifyState.products;
	} catch (error) {
		console.error('Failed to fetch products:', {
			error,
			timestamp: new Date().toISOString()
		});
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
