<script lang="ts" context="module">
	import Joi from 'joi';
	import { onMount } from 'svelte';

	const correct = {
		id: 1,
		order: 10,
		imageComponents: [
			{
				id: 101,
				order: 1,
				image: {
					image: {
						url: 'https://example.com/image1.png'
					}
				},
				positions: [
					{
						id: 201,
						aspectRatio: 1.5,
						x: 100,
						y: 200
					}
				],
				widths: [
					{
						id: 301,
						aspectRatio: 2.0,
						x: 50,
						y: 75
					}
				]
			}
		]
	};

	const incorrect = {
		id: 'abc', // ❌ should be a number
		order: 5,
		imageComponents: [
			{
				id: 101,
				order: 1,
				image: {
					image: {
						// ❌ missing required "url"
					}
				},
				positions: [
					{
						id: 201,
						aspectRatio: '16:9', // ❌ should be a number, not a string
						x: 100,
						y: 200
					}
				],
				widths: [] // ✅ allowed, but still valid if empty
			}
		]
	};
</script>

<script lang="ts">
	const schema = Joi.object({
		id: Joi.number().required(),
		order: Joi.number().required(),
		imageComponents: Joi.array().items(
			Joi.object({
				id: Joi.number().required(),
				order: Joi.number().required(),
				image: Joi.object({
					image: Joi.object({
						url: Joi.string().required()
					})
				}),
				positions: Joi.array().items(
					Joi.object({
						id: Joi.number().required(),
						aspectRatio: Joi.number().required(),
						x: Joi.number().required(),
						y: Joi.number().required()
					})
				),
				widths: Joi.array().items(
					Joi.object({
						id: Joi.number().required(),
						aspectRatio: Joi.number().required(),
						x: Joi.number().required(),
						y: Joi.number().required()
					})
				)
			})
		)
	});

	onMount(() => {
		const correctJoiRes = schema.validate(correct);
		console.log('correctJoiRes:', correctJoiRes);
		const incorrectJoiRes = schema.validate(incorrect, { abortEarly: false });
		console.log('incorrectJoiRes:', incorrectJoiRes);
	});
</script>
