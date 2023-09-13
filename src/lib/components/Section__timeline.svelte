<script>
	import { index } from "d3-array";
	import { location } from "../../stores";
	import BarChart from "./charts/BarChart.svelte";
	import LineChart from "./charts/LineChart.svelte";
	import { quantile, ascending, range } from "d3-array";
	import Autocomplete from "./ui/Autocomplete.svelte";

	export let latestData;
	export let allData;
	export let index_of_selected;

	$: smoke_days = latestData.map((d) => d.bad_air_days);

	let start_age = 30;
	let comparison_age = 10;
	let selected_age;
	$: comparison_year = selected_age
		? 2022 - selected_age + comparison_age
		: 2022 - start_age + comparison_age;

	// Calculate quartile boundaries
	$: q1 = quantile(smoke_days, 0.25);
	$: q2 = quantile(smoke_days, 0.5);
	$: q3 = quantile(smoke_days, 0.75);

	const determineQuartile = (numberToCheck) => {
		if (numberToCheck < q1) {
			return "very low";
		} else if (numberToCheck < q2) {
			return "moderately low";
		} else if (numberToCheck < q3) {
			return "moderately high";
		} else {
			return "very high";
		}
	};

	$: one_city_data = allData.filter((d) => d.code === $location.value);

	$: past_one_city = [...one_city_data].filter(
		(d) => d.year === comparison_year
	)[0]?.bad_air_days;
	$: latest_one_city = [...one_city_data].sort((a, b) =>
		ascending(a.year, b.year)
	)[one_city_data.length - 1].bad_air_days;

	$: highest_one_city = [...one_city_data].sort((a, b) =>
		ascending(a.bad_air_days, b.bad_air_days)
	)[one_city_data.length - 1];

	const age_array = range(10, 43, 1).map((d) => ({
		value: d,
		label: d === 42 ? "42 or older" : d,
	}));
</script>

<section>
	<div class="contents">
		<h2>Is this typical?</h2>
		<p class="subtitle">You be the judge.</p>

		<div class="age">
			<Autocomplete
				name="How old are you?"
				data={age_array}
				bind:selected={selected_age}
				manualSelection={{ value: 30, label: 30 }}
			/>
		</div>
	</div>

	<div class="latest block">
		<h3 class="rail">2022</h3>

		<p class="prose">
			{latestData[index_of_selected].name} experienced {latestData[
				index_of_selected
			].bad_air_days} days with bad air quality in 2022.
		</p>
		<ul>
			<li>
				This is {determineQuartile(latestData[index_of_selected].bad_air_days)} compared
				to all other cities in our data.
			</li>
		</ul>

		<BarChart data={latestData} {index_of_selected} />
	</div>

	<hr />
	<div class="past block">
		<h3 class="rail">{comparison_year}</h3>
		<p class="rail__context">When you were {comparison_age} years old</p>

		<p class="prose">
			<strong>{$location.label}</strong> experienced
			<strong>{past_one_city} bad air quality days</strong>
			when you were {comparison_age} years old.
		</p>

		<ul>
			<li>
				There are {past_one_city > latest_one_city ? "fewer" : "more"} smoky days
				than there were in {comparison_year}.
			</li>

			<li>
				The highest on record was in {highest_one_city.year} when there were {highest_one_city.bad_air_days}
				smoky days reported.
			</li>
		</ul>

		<LineChart data={one_city_data} {comparison_year} />
	</div>
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

	.rail__context {
		width: max-content;
		max-width: 150px;
		text-align: right;
		margin: 0;
		position: absolute;
		top: 4rem;
		right: calc(100% + 2rem);
		font-size: 1.25rem;
	}

	hr {
		margin: 0.4rem 0;
	}

	ul {
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
</style>
