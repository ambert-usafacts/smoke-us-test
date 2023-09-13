<script>
	import { LayerCake, Svg, Html } from "layercake";
	import { scaleBand } from "d3-scale";
	import { location } from "../../../stores";

	import Line from "./Line.svelte";
	import AxisX from "./AxisX.svelte";
	import AxisY from "./AxisY.svelte";
	import LineChartDots from "./LineChartDots.svelte";
	import LineGradient from "./LineGradient.svelte";

	export let data;
	export let comparison_year;

	const xKey = "year";
	const yKey = "bad_air_days";
</script>

<div class="chart-container">
	<LayerCake
		padding={{ top: 0, right: 40, bottom: 20, left: 30 }}
		x={xKey}
		y={yKey}
		xScale={scaleBand().paddingInner(0.02).round(true)}
		yDomain={[0, null]}
		{data}
	>
		<Svg>
			<LineGradient
				yearOfInterest={comparison_year}
				accentColor="var(--secondary)"
			/>
			<Line stroke="url(#line-gradient)" />
			<LineChartDots
				fill="var(--secondary)"
				stroke="var(--secondary)"
				{comparison_year}
			/>
			<AxisX
				gridlines={false}
				ticks={[1980, comparison_year, 2022]}
				baseline={true}
			/>
			<AxisY gridlines={false} baseline={true} />
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
