<!--
  @component
  Generates an SVG area shape using the `area` function from [d3-shape](https://github.com/d3/d3-shape).
 -->
<script>
	import { getContext } from "svelte";
	import { hovered_year, selected_age } from "../../../stores";

	const { data, xGet, yGet, height, width } = getContext("LayerCake");

	/** @type {String} [stroke='#ab00d6'] - The shape's fill color. This is technically optional because it comes with a default value but you'll likely want to replace it with your own color. */
	export let stroke = "var(--gray-style)";

	export let opacity = 1;
	export let comparison_age;

	$: updated_year = $hovered_year
		? $hovered_year
		: 2022 - ($selected_age || 30) + comparison_age;
	$: years = [updated_year, 2022];

	$: axes_data = $data.filter((d) => {
		return years.includes(d.year);
	});

	let PADDING = 8;
</script>

{#each axes_data as point}
	<line
		{stroke}
		class="vert"
		x1={$xGet(point)}
		x2={$xGet(point)}
		y1={$height}
		y2={$yGet(point)}
	/>
	<circle r="4" cx="0" cy={$yGet(point)} />
	<circle r="4" cx={$xGet(point)} cy={$height} />
	<line
		{stroke}
		class="horiz"
		x1="0"
		x2={$xGet(point)}
		y1={$yGet(point)}
		y2={$yGet(point)}
	/>

	<text x={-PADDING} y={$yGet(point)} text-anchor="end"
		>{point.bad_air_days}</text
	>
{/each}

{#if $hovered_year !== 2022 && $hovered_year !== 1980 && axes_data.length >= 1}
	<line
		class="axes"
		x1={$xGet(axes_data[0])}
		x2={$xGet(axes_data[1])}
		y1={$height}
		y2={$height}
	/>

	<line
		class="axes"
		y1={$yGet(axes_data[0])}
		y2={$yGet(axes_data[1])}
		x1="0"
		x2="0"
	/>
{/if}

<style>
	line {
		fill: none;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 1px;
		stroke-dasharray: 0.25rem;
	}

	circle {
		fill: var(--gray-text);
	}

	.axes {
		stroke-width: 2px;
		stroke: var(--gray-text);
		stroke-dasharray: none;
	}

	text {
		font-size: 0.9em;
		font-weight: 400;
		fill: var(--gray-text);
	}
</style>
