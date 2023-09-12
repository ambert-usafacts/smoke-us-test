<script>
	import Autocomplete from "$lib/components/ui/Autocomplete.svelte";
	import { location } from "../../stores.js";

	export let data;

	$: city_options = Array.from(
		new Set(data.map((d) => JSON.stringify([d.name, d.code])))
	)
		.map((str) => JSON.parse(str))
		.map((d) => ({ value: d[1], label: d[0] }))
		.filter((d) => d.label);

	$: city_map = new Map(city_options);

	let selected;
</script>

<section>
	<div class="inline">
		<h1>
			Smoke in <Autocomplete
				data={city_options}
				bind:selected
				name="select a location"
				manualSelection={$location}
				inline={true}
				fontSize="35"
			/>
		</h1>
	</div>

	<p class="prose">
		We experience above and below-seasonal variation in the weather every year.
		Fire smoke is no exception. This year we’ve seen stunning images from
		coast-to-coast during an active fire season in the USA and Canada. Is this
		typical? Or is this year different.
	</p>

	<p class="prose">
		Using data from the government agencies that have this data we can look at
		the number of days with smoke in cities across the country to better
		understand our own experiences.
	</p>
</section>

<style>
	h1 {
		min-width: 100%;
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}
	.inline {
		display: flex;
		flex-direction: row;
		width: 100%;
	}
</style>
