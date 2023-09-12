<!--
  @component
  Generates canvas dots onto a map using [d3-geo](https://github.com/d3/d3-geo).
 -->
<script>
	/** @type {Function} projection - A D3 projection function. Pass this in as an uncalled function, e.g. `projection={geoAlbersUsa}`. */
	import { getContext, createEventDispatcher } from "svelte";
	import { raise } from "layercake";

	const { data, width, height, rScale, rGet, zGet, r } =
		getContext("LayerCake");

	/* --------------------------------------------
	 * Require a D3 projection function
	 */
	export let projection;
	const dispatch = createEventDispatcher();

	/** @type {Number} [r=3.5] - The point's radius. */
	// export let r = 3.5;

	/** @type {String} [fill='yellow'] - The point's fill color. */
	export let fill = "yellow";

	/** @type {String} [stroke='#000'] - The point's stroke color. */
	export let stroke = "#000";

	/** @type {Number} [strokeWidth=1] - The point's stroke width. */
	export let strokeWidth = 1;

	/** @type {Number} [opacity=1] - The point's opacity. */
	export let opacity = 1;

	/** @type {Array} [features] - A list of GeoJSON features to plot. If unset, the plotted features will defaults to those in `$data.features`, assuming this field a list of GeoJSON features. */
	export let features = undefined;

	$: projectionFn = projection().fitSize([$width, $height], $data);

	function handleMousemove(feature) {
		return function handleMousemoveFn(e) {
			raise(this);
			// When the element gets raised, it flashes 0,0 for a second so skip that
			if (e.layerX !== 0 && e.layerY !== 0) {
				dispatch("mousemove", { e, props: feature });
			}
		};
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<g
	class="points"
	on:mouseout={(e) => dispatch("mouseout")}
	on:blur={(e) => dispatch("mouseout")}
>
	{#if features.length}
		{#each features as d (`${d.ori}-${d.name}`)}
			{@const coordinates = projectionFn([d.longitude, d.latitude])}

			<!-- To scale the circle by size, set r to `$rGet(d.properties)` -->
			{#if !isNaN($rGet(d))}
				<circle
					cx={coordinates[0]}
					cy={coordinates[1]}
					r={$rScale(Math.abs($r(d)))}
					fill={fill || $zGet(d)}
					{stroke}
					stroke-width={strokeWidth}
					{opacity}
					on:mouseover={(e) => dispatch("mousemove", { e, props: d })}
					on:focus={(e) => dispatch("mousemove", { e, props: d })}
					on:mousemove={handleMousemove(d)}
					on:click={(e) => dispatch("clickedPoint", { e, props: d })}
				/>
			{/if}
		{/each}
	{/if}
</g>
