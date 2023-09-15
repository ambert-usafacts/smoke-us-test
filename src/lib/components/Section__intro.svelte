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
			Air Quality in <Autocomplete
				data={city_options}
				bind:selected
				name="select a location"
				manualSelection={$location}
				inline={true}
				fontSize="35"
				updateLocation={true}
			/>
		</h1>
	</div>

	<p class="prose">
		We experience above and below-seasonal variation in the weather every year.
		Changes in air quality are no exception. Is this typical? Or is this year
		different.
	</p>

	<p class="prose">
		Using data from the Environmental Protection Agency, we can look at the
		number of days with poor air quality in cities across the country to better
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
