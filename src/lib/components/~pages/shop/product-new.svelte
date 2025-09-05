<script lang="ts" module>
	import { createOptimisedImgUrl } from '^helpers';
</script>

<script lang="ts">
	let props: {
		availableForSale: boolean;
		imgUrl: string;
		previousPrice: null | number;
		price: number;
		shopifyId: string;
		title: string;
	} = $props();
</script>

<a class="block" href={`/shop/${props.shopifyId.split('/').pop()}`}>
	<img
		class="max-h-[620px] w-full"
		src={createOptimisedImgUrl(props.imgUrl)}
		alt="Jewellery made by Amy Rodriguez"
	/>
	<div class="text-lg">
		{#if !props.availableForSale}
			<p>SOLD</p>
		{:else}
			<p>£{props.price.toString().replace('.0', '')}</p>
			{#if props.previousPrice}
				<p class="mt-1 ml-10 text-red-500 line-through">
					£{props.previousPrice.toString().replace('.0', '')}
				</p>
			{/if}
		{/if}
	</div>
</a>
