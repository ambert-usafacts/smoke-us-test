<script>
	import { LayerCake, Svg, Canvas, Html } from "layercake";
	import { feature } from "topojson-client";
	import { geoAlbersUsa } from "d3-geo";
	import { scaleQuantize, scaleSqrt } from "d3-scale";
	import Map from "./Map.canvas.svelte";
	import MapPoints from "./MapPoints.svelte";
	import Tooltip from "./Tooltip.svelte";
	import { location } from "../../../stores";
	import BubbleMapAnnotations from "./BubbleMapAnnotations.svelte";

	export let data;
	export let us_states;
	export let cbsa_lookup;

	let evt;
	let hideTooltip = true;

	const geojson = feature(us_states, us_states.objects.collection);
	const projection = geoAlbersUsa;

	const flatData = geojson.features.map((d) => d.properties);

	$: features = data
		.map((d) => ({
			...d,
			latitude: cbsa_lookup.get(d.code)?.latitude,
			longitude: cbsa_lookup.get(d.code)?.longitude,
		}))
		.filter((d) => d.latitude)
		.filter((d) => d.longitude);
</script>

<div class="container">
	<LayerCake
		data={geojson}
		{flatData}
		r="bad_air_days"
		rScale={scaleSqrt().clamp(true)}
		rRange={[1, 15]}
		rDomain={[0, 365]}
	>
		<Canvas>
			<Map {projection} fill="#fff" />
		</Canvas>

		<Svg>
			<MapPoints
				{projection}
				{features}
				fill="var(--secondary)"
				stroke="var(--color-bg)"
				on:mousemove={(event) => (evt = hideTooltip = event)}
				on:mouseout={() => (hideTooltip = true)}
				on:clickedPoint={(event) => {
					const { detail } = event;
					const { props } = detail;
					// set page location
					$location = { value: props?.code, label: props?.name };
				}}
			/>

			<BubbleMapAnnotations {features} />
		</Svg>

		<Html pointerEvents={false}>
			{#if hideTooltip !== true}
				<Tooltip {evt} let:detail>
					<!-- For the tooltip, do another data join because the hover event only has the data from the geography data -->
					{@const tooltipData = { ...detail.props }}
					<p class="name">{tooltipData.name}</p>
					<p class="days">{tooltipData.bad_air_days} bad air days</p>

					<!-- {#each Object.entries(tooltipData) as [key, value]}
                    {@const keyCapitalized = key.replace(/^\w/, (d) => d.toUpperCase())}
                    <div class="row"><span>{keyCapitalized}:</span> {value}</div>
                {/each} -->
				</Tooltip>
			{/if}
		</Html>
	</LayerCake>
</div>

<style>
	.container {
		height: 500px;
		width: 100%;
	}

	.name {
		font-weight: bold;
	}
</style>
