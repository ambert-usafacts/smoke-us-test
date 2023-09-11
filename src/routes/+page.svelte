<script>
	import SectionThisYear from "$lib/components/Section__thisYear.svelte";
	export let data;

	$: ({ city_data, cbsa } = data);

	$: cbsa_lookup = new Map(
		cbsa.map((d) => [
			d.GEOID,
			{ name: d.NAME, lat: d.INTPTLAT, long: d.INTPTLONG },
		])
	);

	$: cleanedData = city_data.map((d) => ({
		...d,
		year: +d.year,
		bad_air_days: +d.n,
		name: cbsa_lookup.get(d["CBSA Code"])?.name,
	}));
</script>

<h1>Smoke in the United States</h1>
<p>More prototype to come!</p>

<SectionThisYear data={cleanedData} />
