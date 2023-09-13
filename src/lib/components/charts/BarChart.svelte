<script>
	import { LayerCake, Svg, Html } from "layercake";
	import { scaleBand } from "d3-scale";
	import { location } from "../../../stores";

	import Bar from "./Bar.svelte";
	import AxisX from "./AxisX.svelte";
	import AxisY from "./AxisY.svelte";

	export let data;
	export let index_of_selected;

	const xKey = "name";
	const yKey = "bad_air_days";

	$: ticks = [];

	$: if (index_of_selected > data.length / 2) {
		ticks = [$location.label, data[0].name];
	} else {
		ticks = [$location.label, data[data.length - 1].name];
	}

	$: fillFunction = (d) => {
		if (d.code === $location.value) return "var(--primary)";
		else return "var(--secondary)";
	};
</script>

<div class="chart-container">
	<LayerCake
		padding={{ top: 0, right: 40, bottom: 20, left: 30 }}
		x={xKey}
		y={yKey}
		xScale={scaleBand().paddingInner(0.02).round(true)}
		yDomain={[0, null]}
		{data}
		xReverse={true}
	>
		<Svg>
			<Bar {fillFunction} />
			<AxisX gridlines={false} {ticks} tickMarks={true} />
		</Svg>
	</LayerCake>
</div>

<style>
	.chart-container {
		width: 100%;
		aspect-ratio: 3/2;
		padding: 2rem 0;
	}
</style>
