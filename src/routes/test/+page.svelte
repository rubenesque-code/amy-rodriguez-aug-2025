<script lang="ts" context="module">
	import { validateByFieldType } from '^lib/db/portfolio';
	import type { Db, DeepPartial } from '^lib/types';
	import { onMount } from 'svelte';

	const invalidItemIncorrectTypes: DeepPartial<Db['PortfolioPage']> = {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		id: 1,
		order: 1,
		created_at: '2023-01-01T00:00:00Z',
		updated_at: '2023-01-01T00:00:00Z',
		imageComponents: []
	};
</script>

<script lang="ts">
	onMount(() => {
		validateByFieldType(invalidItemIncorrectTypes as Db['PortfolioPage']);
	});
</script>
