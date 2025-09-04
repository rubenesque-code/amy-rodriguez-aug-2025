<script lang="ts" module>
	import { onMount } from 'svelte';

	import { shopifyHelper as shopifyApi, shopifyState } from '^lib/stores';

	import { Product } from '^components/~pages/shop';
	import type { SiteSchema } from '^types';
	import type { DbSchema } from '^db';

	// todo - test whether buildtimeerror actually leads to build fail

	function remapProductDbToShop(
		productDb: DbSchema['ProductProcessed']
	): SiteSchema['ShopProductDb'] {
		const image =
			productDb.images.find((image) => image.shopHomeStatus === 'main') || productDb.images[0];

		return {
			id: productDb.id,
			image: {
				positions: productDb.shopHomeImgPositions.map((item) => ({
					...item,
					id: crypto.randomUUID()
				})),
				url: image.image.image.url,
				widths: productDb.shopHomeImgWidths.map((item) => ({
					...item,
					id: crypto.randomUUID()
				}))
			}
		};
	}
</script>

<script lang="ts">
	let { data: buildTimeData } = $props();

	const products = $derived.by(() => {
		if (!shopifyState.products || shopifyState.fetchProductsStatus !== 'success') {
			return;
		}

		return shopifyState.products
			.filter((productShopify) => buildTimeData.productsDb.map.has(productShopify.id))
			.map((productShopify) => {
				const productDb = buildTimeData.productsDb.map.get(productShopify.id)!;

				return {
					db: remapProductDbToShop(productDb),
					shopify: productShopify
				};
			});
	});

	onMount(() => {
		shopifyApi.products.fetch();
	});
</script>

{#if shopifyState.fetchProductsStatus === 'pending'}
	FETCHING
{:else if shopifyState.fetchProductsStatus === 'error'}
	ERROR
{:else if shopifyState.fetchProductsStatus === 'success' && products}
	{#each products as product}
		<Product
			availableForSale={product.shopify.availableForSale}
			imgUrl={product.db.image.url}
			positions={product.db.image.positions}
			previousPrice={product.shopify.preSalePrice}
			price={product.shopify.price}
			shopifyId={product.shopify.id}
			title={product.shopify.title}
			widths={product.db.image.widths}
		/>
	{/each}
{/if}
