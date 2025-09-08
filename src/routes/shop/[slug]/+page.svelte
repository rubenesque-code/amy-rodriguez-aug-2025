<script lang="ts">
	let { data } = $props();
	console.log('data:', data.db);
</script>

{JSON.stringify(data, null, 2)}
