<script>
	import { getContext } from "svelte";

	const { data, width, height } = getContext("LayerCake");

	export let features;
	export let projection;

	const PADDING = 25;

	$: projectionFn = projection().fitSize([$width, $height], $data);

	$: worst = features[0];

	$: best = features[features.length - 1];

	$: worst_location = projectionFn([worst.longitude, worst.latitude]);

	$: best_location = projectionFn([best.longitude, best.latitude]);
</script>

<p
	class="worst"
	style:top="{worst_location[1] + PADDING}px"
	style:left="{worst_location[0]}px"
>
	<strong>The Worst:</strong>
	{worst.name}
</p>

<p
	class="best"
	style:top="{best_location[1]}px"
	style:left="{best_location[0]}px"
>
	<strong>The Best:</strong>
	{best.name}
</p>

<style>
	p {
		position: absolute;
		max-width: 150px;
		text-align: left;
		text-shadow: var(--text-outline);
	}
</style>
