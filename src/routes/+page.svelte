<script>
	import SectionThisYear from "$lib/components/Section__thisYear.svelte";
	import SectionIntro from "../lib/components/Section__intro.svelte";
	import SectionTimeline from "../lib/components/Section__timeline.svelte";
	import { descending } from "d3-array";

	import { location } from "../stores";

	export let data;

	$: ({ city_data, cbsa, us_states } = data);

	$: cbsa_lookup = new Map(
		cbsa.map((d) => [
			d.GEOID,
			{ name: d.NAME, latitude: +d.latitude, longitude: +d.longitude },
		])
	);

	$: cleanedData = city_data.map((d) => ({
		...d,
		year: +d.year,
		bad_air_days: +d.n,
		name: cbsa_lookup.get(d["CBSA Code"])?.name,
		code: d["CBSA Code"],
	}));

	$: latestData = cleanedData
		.filter((d) => d.year === 2022)
		.sort((a, b) => descending(a.bad_air_days, b.bad_air_days));

	$: index_of_selected = latestData.findIndex(
		(item) => item["CBSA Code"] === $location?.value
	);
</script>

<SectionIntro data={latestData} />

<SectionThisYear
	data={cleanedData}
	{us_states}
	{cbsa_lookup}
	{index_of_selected}
/>

<SectionTimeline {latestData} allData={cleanedData} {index_of_selected} />
