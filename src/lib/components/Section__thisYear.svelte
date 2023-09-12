<script>
	import { descending } from "d3-array";
	import { location } from "../../stores.js";
	export let data;

	$: latestData = data
		.filter((d) => d.year === 2022)
		.sort((a, b) => descending(a.bad_air_days, b.bad_air_days));

	$: splitData = latestData.slice(0, 10);

	$: index_of_selected = latestData.findIndex(
		(item) => item["CBSA Code"] === $location?.value
	);

	$: console.log({ latestData, index_of_selected });
</script>

<section>
	<h2>The 10 Smokiest Places in 2022</h2>
	<ol>
		{#each splitData as { name, bad_air_days }}
			<li><span role="button">{name}</span> - {bad_air_days} smoky days</li>
		{/each}
	</ol>

	<p class="prose">
		In 2022 (our most recent year of data), <strong
			>{latestData[0]?.name}</strong
		>
		was the smokiest city in the USA. If you were living in that area, you might
		remember up to <strong>{latestData[0]?.bad_air_days}</strong> days of haze and
		low air quality.
	</p>

	<p class="prose">
		For comparison, <strong>{$location?.label}</strong> ranked number
		<strong
			>{index_of_selected + 1}
			out of {latestData.length}</strong
		>
		locations with <strong>{latestData[index_of_selected].bad_air_days}</strong>
		low air quality days in 2022.
	</p>
</section>

<style>
	ol {
		display: flex;
		flex-wrap: wrap;
		max-height: 150px;
		flex-direction: column;
		gap: 0.75rem 1rem;
		padding-left: 0;
		list-style-position: inside;
		margin-bottom: 3rem;
	}

	li {
		flex-basis: calc(50% - 1rem);
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
