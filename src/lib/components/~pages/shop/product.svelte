<script lang="ts" module>
	import { produce } from 'immer';

	import type { Position, SiteSchema, StyleWithSingleValue } from '^lib/types';
	import { createOptimisedImgUrl } from '^helpers';
</script>

<script lang="ts">
	let props: {
		availableForSale: boolean;
		imgUrl: string;
		positions: SiteSchema['Position'][];
		previousPrice: null | number;
		price: number;
		widths: SiteSchema['StyleDefault'][];
		title: string;
		shopifyId: string;
	} = $props();

	let windowHeight = $state<number>(window.innerHeight || 0);
	let windowWidth = $state<number>(window.innerWidth || 0);
	let windowAspectRatio: number | null = $derived(
		windowHeight && windowWidth ? windowWidth / windowHeight : null
	);

	const positionsOrdered = $derived.by(() =>
		produce(props.positions, (draft) => draft.sort((a, b) => b.aspectRatio - a.aspectRatio))
	);
	const widthsOrdered = $derived.by(() =>
		produce(props.widths, (draft) => draft.sort((a, b) => b.aspectRatio - a.aspectRatio))
	);

	let containerNode = $state<HTMLElement | null>(null);

	let position = $derived.by(() => {
		if (!windowAspectRatio) {
			return;
		}

		for (let i = 0; i < positionsOrdered.length; i++) {
			const currentItem = positionsOrdered[i];
			const nextItem = positionsOrdered[i + 1];

			if (!nextItem) {
				return currentItem;
			}

			if (currentItem.aspectRatio > windowAspectRatio && nextItem.aspectRatio < windowAspectRatio) {
				return currentItem;
			}
		}
	});

	let width = $derived.by(() => {
		if (!windowAspectRatio) {
			return;
		}

		for (let i = 0; i < widthsOrdered.length; i++) {
			const currentItem = widthsOrdered[i];
			const nextItem = widthsOrdered[i + 1];

			if (!nextItem) {
				return currentItem;
			}

			if (currentItem.aspectRatio > windowAspectRatio && nextItem.aspectRatio < windowAspectRatio) {
				return currentItem;
			}
		}
	});

	$effect(() => {
		if (!position || !width || !containerNode) {
			return;
		}

		containerNode.style.left = `${position.x}vw`;
		containerNode.style.top = `${position.y}vh`;
		containerNode.style.width = `${width.value}vw`;
	});
</script>

<svelte:window bind:innerHeight={windowHeight} bind:innerWidth={windowWidth} />

<a
	class="absolute block"
	href={`/shop/${props.shopifyId.split('/').pop()}`}
	bind:this={containerNode}
>
	<img
		class="w-full"
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
