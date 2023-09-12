<script>
	import SectionThisYear from "$lib/components/Section__thisYear.svelte";
	import SectionIntro from "../lib/components/Section__intro.svelte";
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
</script>

<SectionIntro data={cleanedData} />

<SectionThisYear data={cleanedData} {us_states} {cbsa_lookup} />
