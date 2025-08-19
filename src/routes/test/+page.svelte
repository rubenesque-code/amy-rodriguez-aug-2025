<script lang="ts" context="module">
	import { validate } from '^lib/db/portfolio';
	import type { Db, DeepPartial } from '^lib/types';
	import { mapDbToSiteSchema } from '^lib/utils/transform-db-data/portfolio';
	import { onMount } from 'svelte';

	const input: DeepPartial<Db['PortfolioPage']> = {
		id: 1,
		order: 1,
		created_at: '2023-01-01T00:00:00Z',
		updated_at: '2023-01-01T00:00:00Z',
		imageComponents: [
			{
				id: 2,
				layer: 0,
				order: 2,
				image: {
					id: 3,
					created_at: '2023-01-01T00:00:00Z',
					updated_at: '2023-01-01T00:00:00Z',
					image: {
						url: 'https://example.com/image1.jpg'
					}
				},
				positions: [
					{
						id: 4,
						aspectRatio: 1.5,
						x: 100,
						y: 200
					},
					{
						id: 5,
						aspectRatio: 1.7,
						x: 150,
						y: 250
					}
				],
				widths: [
					{
						id: 6,
						aspectRatio: 1.5,
						value: 50
					},
					{
						id: 7,
						aspectRatio: 1.7,
						value: 75
					}
				]
			}
		]
	};
</script>

<script lang="ts">
	onMount(() => {
		const result = mapDbToSiteSchema(input as Db['PortfolioPage']);
		console.log('result:', result);
	});
</script>
