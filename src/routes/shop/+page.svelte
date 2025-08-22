<script module>
	import { onMount } from 'svelte';

	import { shopifyHelper as shopifyApi, shopifyState } from '^lib/stores';
</script>

<script lang="ts">
	let { data } = $props();

	$inspect('SHOPIFY PRODUCTS', shopifyState.products);

	const combinedProducts = $derived.by(() => {
		if (!shopifyState.products) {
			return;
		}

		const productsDbMap = new Map(data.productsDb.map((p) => [p.shopifyId, p]));

		return shopifyState.products
			.filter((productShopify) => productsDbMap.has(productShopify.id))
			.map((productShopify) => ({
				db: productsDbMap.get(productShopify.id)!,
				shopify: productShopify
			}));
	});

	$inspect('COMBINED PRODUCTS', combinedProducts);

	onMount(() => {
		shopifyApi.products.fetch();
	});
</script>

{JSON.stringify(data)}
