<script>
	import { LayerCake, Svg, Html } from "layercake";
	import { scaleBand } from "d3-scale";
	import QuadTree from "./QuadTree.svelte";
	import { location, hovered_year } from "../../../stores";
	import { max } from "d3-array";

	import Line from "./Line.svelte";
	import AxisX from "./AxisX.svelte";
	import AxisY from "./AxisY.svelte";
	import LineChartDots from "./LineChartDots.svelte";
	import LineGradient from "./LineGradient.svelte";
	import LineChartAnnotationAxes from "./LineChartAnnotationAxes.svelte";

	export let data;
	export let comparison_year;
	export let comparison_age;

	$: updated_year = $hovered_year ? $hovered_year : comparison_year;

	const xKey = "year";
	const yKey = "bad_air_days";

	const padding = 6;

	$: max_y = max(data.map((d) => d[yKey]));

	$: x_ticks = [...new Set([1980, updated_year, 2022])];
</script>

<div class="chart-container">
	<LayerCake
		x={xKey}
		y={yKey}
		xScale={scaleBand().paddingInner(0.02).round(true)}
		yDomain={[0, null]}
		{data}
		xPadding={[padding, padding]}
		yPadding={[padding, padding]}
		padding={{ top: 0, right: 5, bottom: 20, left: 25 }}
	>
		<Svg>
			<AxisX gridlines={false} ticks={x_ticks} baseline={true} />
			<AxisY gridlines={false} baseline={true} ticks={1} />
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
			<LineChartAnnotationAxes {comparison_age} />
		</Svg>

		<Html>
			<QuadTree let:x let:y let:visible let:found>
				<div
					class="circle"
					style="top:{y}px;left:{x}px;display: {visible ? 'block' : 'none'};"
				/>
			</QuadTree>
		</Html>
	</LayerCake>
</div>

<style>
	.chart-container {
		width: 100%;
		aspect-ratio: 5/2;
		padding: 2rem 0;
	}

	.circle {
		position: absolute;
		border-radius: 50%;
		background-color: var(--secondary);
		transform: translate(-50%, -50%);
		pointer-events: none;
		width: 12px;
		height: 12px;
	}

	.label {
		position: absolute;
		transform: translate(-50%, -200%);
		background-color: var(--color-bg);
	}

	.year {
		position: absolute;
		bottom: 0px;
		transform: translate(-50%, 180%);
		background-color: var(--color-bg);
	}
</style>
