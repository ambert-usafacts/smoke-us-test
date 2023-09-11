<script>
	import { descending } from "d3-array";
	export let data;

	$: latestData = data
		.filter((d) => d.year === 2022)
		.sort((a, b) => descending(a.bad_air_days, b.bad_air_days));

	$: splitData = latestData.slice(0, 10);
</script>

<section>
	<h2>The 10 Smokiest Places in 2022</h2>
	<ol>
		{#each splitData as { name, bad_air_days }}
			<li><button>{name}</button> - {bad_air_days} smoky days</li>
		{/each}
	</ol>
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
	}

	li {
		flex-basis: calc(50% - 1rem);
	}

	@media screen and (max-width: 1000px) {
		ol {
			flex-wrap: nowrap;
			height: auto;
			max-height: 5000px;
		}
	}
</style>
