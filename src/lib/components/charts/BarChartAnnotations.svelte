<script>
	import { getContext } from "svelte";
	import { location } from "../../../stores";

	const { data, width, heigh, xGet, yGet, yScale, xScale } =
		getContext("LayerCake");

	export let found;

	$: pre_selected_location = $data.find((el) => el.code === $location.value);
	const PADDING = 25;

	$: this_location =
		found && Object.keys(found).length ? found : pre_selected_location;
</script>

<p style:top="{$yGet(this_location)}px" style:left="{$xGet(this_location)}px">
	{this_location.bad_air_days}
</p>

<p />

<style>
	p {
		position: absolute;
		max-width: 150px;
		text-align: center;
		text-shadow: var(--text-outline);
		transform: translate(-25%, -150%);
	}
</style>
