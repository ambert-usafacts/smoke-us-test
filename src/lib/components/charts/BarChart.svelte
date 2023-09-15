<script>
	import { LayerCake, Svg, Html } from "layercake";
	import { scaleBand } from "d3-scale";
	import { location } from "../../../stores";

	import Bar from "./Bar.svelte";
	import AxisX from "./AxisX.svelte";
	import AxisY from "./AxisY.svelte";
	import QuadTree from "./QuadTree.svelte";
	import BarChartAnnotations from "./BarChartAnnotations.svelte";
	import PointInverter from "./PointInverter.svelte";

	export let data;
	export let index_of_selected;

	const xKey = "name";
	const yKey = "bad_air_days";

	// $: ticks = [];

	// $: if (index_of_selected > data.length / 2) {
	// 	ticks = [$location.label, data[0].name];
	// } else {
	// 	ticks = [$location.label, data[data.length - 1].name];
	// }

	let ticks;

	$: if (found && Object.keys(found).length) {
		ticks = [found.name];
	} else {
		ticks = [$location.label];
	}

	let found;

	$: fillFunction = (d) => {
		if (found && Object.keys(found).length) {
			if (d.code === found.code) return "var(--primary)";
		} else if (d.code === $location.value) {
			return "var(--primary)";
		}
		return "var(--secondary)";
	};
</script>

<div class="chart-container">
	<LayerCake
		padding={{ top: 0, right: 0, bottom: 20, left: 0 }}
		x={xKey}
		y={yKey}
		xScale={scaleBand().paddingInner(0.01)}
		yDomain={[0, null]}
		{data}
		xReverse={true}
	>
		<Svg>
			<Bar {fillFunction} />
			<AxisX gridlines={false} {ticks} tickMarks={true} />
		</Svg>

		<Html>
			<BarChartAnnotations {found} />
			<PointInverter bind:found />
			<!-- <QuadTree let:x let:y let:visible bind:found /> -->
		</Html>
	</LayerCake>
</div>

<style>
	.chart-container {
		width: 100%;
		aspect-ratio: 1.5;
		padding: 2rem 0;
	}

	.value {
		position: absolute;
		pointer-events: none;
		margin: 0;
	}
</style>
