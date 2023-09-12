<script>
	import { getContext } from "svelte";

	const { data, width, height, rScale, rGet, zGet, r, xGet, yGet } =
		getContext("LayerCake");

	export let features;

	$: worst = features[0];

	$: best = features[features.length - 1];
</script>

<!-- <p class="worst" style:top="{$yGet(worst)}px" , style:left="{$xGet(worst)}px">
	{worst.name}
</p> -->

<style>
	p {
		position: absolute;
	}
</style>
