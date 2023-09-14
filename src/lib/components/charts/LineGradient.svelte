<script>
	import { getContext } from "svelte";
	import { extent } from "d3-array";
	import { hovered_year } from "../../../stores";

	const { data, xGet, yGet, xScale, yScale, x, zGet, zScale, height } =
		getContext("LayerCake");

	export let yearOfInterest = 2008;
	export let accentColor;

	$: extentYears = extent($data, (d) => d.year);

	$: yearCount = extentYears[1] - extentYears[0];

	$: updatedYear = $hovered_year ? $hovered_year : yearOfInterest;

	$: percentYearOfInterest = (updatedYear - extentYears[0]) / yearCount;
</script>

<defs>
	<linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
		<stop
			offset={percentYearOfInterest}
			stop-color={accentColor}
			stop-opacity="0.25"
		/>
		<stop
			offset={percentYearOfInterest}
			stop-color={accentColor}
			stop-opacity="1"
		/>
	</linearGradient>
</defs>
