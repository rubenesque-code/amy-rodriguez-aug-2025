<script lang="ts" context="module">
	import { onMount } from 'svelte';
	import { produce } from 'immer';

	import type { DynamicImage } from '^types';

	import { createOptimisedImgUrl } from '^helpers/cloudinary';
</script>

<script lang="ts">
	export let data: DynamicImage;
	export let transitionOut = false;
	export let transitionDuration: number = 300;

	let transitionIn = true;

	onMount(() => {
		setTimeout(() => {
			transitionIn = false;
		}, transitionDuration);
	});

	let windowWidth: number;
	let windowHeight: number;
	let windowAspectRatio: number;

	$: if (windowHeight && windowWidth) {
		windowAspectRatio = windowWidth / windowHeight;
	}

	let imageNode: HTMLImageElement;

	const positionsOrdered = produce(data.positions, (draft) => {
		return draft.sort((a, b) => b.aspectRatio - a.aspectRatio);
	});
	const widthsOrdered = produce(data.widths, (draft) => {
		return draft.sort((a, b) => b.aspectRatio - a.aspectRatio);
	});

	let position: DynamicImage['positions'][number];

	$: if (windowAspectRatio && imageNode) {
		for (let i = 0; i < positionsOrdered.length; i++) {
			const currentItem = positionsOrdered[i];
			const nextItem = positionsOrdered[i + 1];

			if (!nextItem) {
				position = currentItem;
				break;
			}

			if (currentItem.aspectRatio > windowAspectRatio && nextItem.aspectRatio < windowAspectRatio) {
				position = currentItem;
				break;
			}
		}

		imageNode.style.left = `${position.x}vw`;
		imageNode.style.top = `${position.y}vh`;
	}

	let width: DynamicImage['widths'][number];

	$: if (windowAspectRatio && imageNode) {
		for (let i = 0; i < widthsOrdered.length; i++) {
			const currentItem = widthsOrdered[i];
			const nextItem = widthsOrdered[i + 1];

			if (!nextItem) {
				width = currentItem;
				break;
			}

			if (currentItem.aspectRatio > windowAspectRatio && nextItem.aspectRatio < windowAspectRatio) {
				width = currentItem;
				break;
			}
		}

		imageNode.style.width = `${width.value}vw`;
	}
</script>

<svelte:window bind:innerHeight={windowHeight} bind:innerWidth={windowWidth} />

<img
	class={`dynamic-image absolute object-contain ${transitionIn || transitionOut ? 'opacity-0' : ''}`}
	style="transition-duration: {transitionDuration}ms; transition-property: opacity;"
	src={createOptimisedImgUrl(data.url)}
	alt="Jewellery hand-made by Amy Rodriguez"
	bind:this={imageNode}
/>
