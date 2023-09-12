<script>
	import { descending } from "d3-array";
	import { location } from "../../stores.js";
	import BubbleMap from "./charts/BubbleMap.svelte";

	export let data;
	export let us_states;
	export let cbsa_lookup;
	export let index_of_selected;

	$: splitData = data.slice(0, 10);

	const handle_location_click = (name, code) => {
		$location = { value: code, label: name };
	};
</script>

<section>
	<h2>The 10 Smokiest Places in 2022</h2>
	<ol>
		{#each splitData as { name, code, bad_air_days }}
			<li>
				<span role="button" on:click={handle_location_click(name, code)}
					>{name}</span
				>
				- {bad_air_days} days
			</li>
		{/each}
	</ol>

	<p class="prose">
		In 2022 (our most recent year of data), <strong>{data[0]?.name}</strong>
		was the smokiest city in the USA. If you were living in that area, you might
		remember up to <strong>{data[0]?.bad_air_days}</strong> days of haze and low
		air quality.
	</p>

	<p class="prose">
		For comparison, <strong>{$location?.label}</strong> ranked number
		<strong
			>{index_of_selected + 1}
			out of {data.length}</strong
		>
		locations with <strong>{data[index_of_selected].bad_air_days}</strong>
		low air quality days in 2022.
	</p>

	<BubbleMap {data} {us_states} {cbsa_lookup} />
</section>

<style>
	ol {
		display: flex;
		flex-wrap: wrap;
		max-height: 170px;
		flex-direction: column;
		gap: 0.75rem 1rem;
		padding-left: 0;
		list-style-position: inside;
		margin-bottom: 3rem;
	}

	li {
		flex-basis: calc(50% - 1rem);
		font-size: 1.2rem;
	}

	span[role="button"] {
		color: blue;
		text-decoration: underline;
		cursor: pointer;
	}

	@media screen and (max-width: 1200px) {
		ol {
			flex-wrap: nowrap;
			height: auto;
			max-height: 5000px;
		}
	}
</style>
