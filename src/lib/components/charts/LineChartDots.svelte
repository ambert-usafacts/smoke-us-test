<!--
  @component
  Generates an SVG area shape using the `area` function from [d3-shape](https://github.com/d3/d3-shape).
 -->
<script>
	import { getContext } from "svelte";
	import { hovered_year } from "../../../stores";

	const { data, xGet, yGet, xScale } = getContext("LayerCake");

	export let comparison_year;

	/** @type {String} [stroke='#ab00d6'] - The shape's fill color. This is technically optional because it comes with a default value but you'll likely want to replace it with your own color. */
	export let fill = "#ab00d6";

	export let stroke = "#ab00d6";

	$: updated_year = $hovered_year ? $hovered_year : comparison_year;

	$: years = [updated_year, 2022];

	$: circle_data = $data.filter((d) => years.includes(d.year));
</script>

{#each circle_data as year, i}
	<!-- <text x={$xGet(year)} y={$yGet(year) - 16} class="bg"
		>{year?.bad_air_days}{i !== 0 ? "days" : ""}</text
	>
	<text x={$xGet(year)} y={$yGet(year) - 16}
		>{year?.bad_air_days}{i !== 0 ? " days" : ""}</text
	> -->
	<circle r="6" {fill} cx={$xGet(year)} cy={$yGet(year)} />
{/each}

<style>
	text {
		text-anchor: middle;
		font-size: 0.95rem;
		fill: var(--gray-text);
	}

	.bg {
		font-weight: bold;
		fill: var(--color-bg);
	}
</style>
