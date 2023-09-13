<script>
	import { LayerCake, Svg, Html } from "layercake";
	import { scaleBand } from "d3-scale";
	import QuadTree from "./QuadTree.svelte";
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

	const padding = 6;
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

		<Html>
			<QuadTree let:x let:y let:visible let:found>
				<div
					class="circle"
					style="top:{y}px;left:{x}px;display: {visible ? 'block' : 'none'};"
				/>
				<p
					class="label"
					style:top="{y}px"
					style:left="{x}px"
					style:display={visible ? "block" : "none"}
				>
					{found.bad_air_days}
				</p>
				<p
					class="year"
					style:left="{x}px"
					style:display={visible ? "block" : "none"}
				>
					{found.year}
				</p>
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
		background-color: rgba(171, 0, 214);
		transform: translate(-50%, -50%);
		pointer-events: none;
		width: 10px;
		height: 10px;
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
