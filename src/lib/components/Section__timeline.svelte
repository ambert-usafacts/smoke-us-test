<script>
	import { index } from "d3-array";
	import { location } from "../../stores";
	import BarChart from "./charts/BarChart.svelte";

	export let latestData;
	export let allData;
	export let index_of_selected;
</script>

<section>
	<div class="contents">
		<h2>Is this typical?</h2>
		<p class="subtitle">You be the judge.</p>
	</div>

	<div class="latest block">
		<h3 class="rail">2022</h3>

		<p class="prose">
			{latestData[index_of_selected].name} experienced {latestData[
				index_of_selected
			].bad_air_days} with bad air quality.
		</p>

		<BarChart data={latestData} {index_of_selected} />
	</div>
	<div class="past block" />
</section>

<style>
	section {
		border-top: 1px solid var(--gray-style);
		margin-top: 2rem;
		padding-top: 2rem;
		width: 100%;
		max-width: 100%;
		position: relative;
	}

	.contents {
		max-width: 50rem;
		margin: 0 auto;
		padding: 0 1rem;
	}

	h2 {
		font-size: 4rem;
		font-weight: 700;
		text-transform: uppercase;
	}

	.subtitle {
		font-size: 2.5rem;
	}

	.block {
		border-left: 1px solid var(--gray-style);
		max-width: 50rem;
		margin: 0 auto;
		padding: 1rem;
		position: relative;
	}

	.rail {
		font-size: 2.5rem;
		font-weight: bold;
		width: max-content;
		margin: 0;
		position: absolute;
		top: 1rem;
		right: calc(100% + 2rem);
	}
</style>