<script>
	// based on suggestions from:
	// Adam Silver https://adamsilver.io/blog/building-an-accessible-autocomplete-control/
	import { ascending } from "d3-array";
	import Close from "svelte-material-icons/Close.svelte";
	import { location } from "../../../stores";

	export let data;
	export let name;
	export let fontSize = 16;
	export let selected = "";
	export let clearButton = true;
	export let manualSelection = {}; // expects an object with structure {value: myValue, label: myLabel}
	export let inline = false;
	// export let twoWayBinding = false;
	let filteredData = data.sort((a, b) => ascending(a.label, b.label));
	let uniqueID = Math.floor(Math.random() * 100);

	let resultCount = filteredData.length;
	let textInput = selected;
	let menuOpen = false;
	let focusedInput = false;

	let inputElement;
	let optionElements = [];
	let highlightedIndex;
	let takeoverKeys = true;

	$: if (selected === "") textInput = "";

	$: console.log({ textInput });

	const keysToIgnore = [
		"Escape",
		"ArrowUp",
		"ArrowLeft",
		"ArrowRight",
		"ArrowDown",
		"Space",
		"Enter",
		"Tab",
		"Shift",
	];

	function handleKeyUp(event) {
		if (!keysToIgnore.includes(event.key) && textInput && textInput.length) {
			filteredData = data.filter((d) => {
				console.log({ label: d.label });
				// filter the data to include any where the label includes the text string typed so far
				return d.label.toLowerCase().includes(textInput.toLowerCase());
			});

			// open the menu
			menuOpen = true;
			resultCount = filteredData.length;
		}

		if (event.key === "Tab") {
			menuOpen = false;
		}

		// if the down arrow is pressed, highlight the first option
		if (event.key === "ArrowDown" && filteredData && filteredData.length) {
			menuOpen = true;
			highlightedIndex = 0;
			optionElements[0].focus();
		}
	}

	function handleKeyDown(event) {
		// hide menu if you tab away from input
		if (event.key === "Tab") menuOpen = false;
		if (textInput && textInput.length === 1 && event.key === "Backspace") {
			filteredData = data;
			selected = "";
		}
		if (event.key === "Escape") menuOpen = false;
	}

	function handleInputFocus() {
		menuOpen != menuOpen;
		focusedInput = true;
	}

	function handleOptionSelect(value, label) {
		selected = value;
		textInput = label;
		menuOpen = false;
		inputElement.focus();

		$location = { value, label };
	}

	function handleOptionKeydown(event, value, label) {
		const key = event.key;
		const watchKeys = ["Enter", "ArrowDown", "ArrowUp", "Escape"];
		if (watchKeys.includes(key)) {
			if (key === "Enter") {
				handleOptionSelect(value, label);
				takeoverKeys = false;
			}
			if (key === "ArrowDown" && filteredData && filteredData.length) {
				highlightedIndex =
					highlightedIndex < filteredData.length - 1
						? highlightedIndex + 1
						: filteredData.length - 1;
				optionElements[highlightedIndex].focus();
				takeoverKeys = true;
			}
			if (key === "Escape") {
				menuOpen = false;
				inputElement.focus();
			}

			if (key === "ArrowUp" && highlightedIndex === 0) {
				inputElement.focus();
				highlightedIndex = null;
				takeoverKeys = true;
			} else if (key === "ArrowUp" && highlightedIndex != 0) {
				highlightedIndex -= 1;
				optionElements[highlightedIndex].focus();
				takeoverKeys = true;
			}
		} else takeoverKeys = false;
		// prevent page down behavior on arrow down
		if (takeoverKeys === true) event.preventDefault();
	}

	function handleInputClick() {
		textInput = "";
		manualSelection = {};
		menuOpen = true;
		filteredData = data;
		highlightedIndex = null;
	}

	function handleBodyClick(node) {
		const target = node.target;
		if (target != inputElement && !optionElements.includes(target)) {
			menuOpen = false;
		}
	}

	function clearAutocomplete() {
		textInput = "";
		selected = "";
		manualSelection = {};
	}

	$: if (manualSelection?.value) {
		selected = manualSelection.value;
		textInput = manualSelection.label;
	}
</script>

<svelte:window on:click={handleBodyClick} />

<div
	class="field"
	style="font-size:{fontSize}px"
	id={`field-${uniqueID}-${name}`}
	style:flex={inline ? "1 1 auto" : "auto"}
>
	<label
		for={`${uniqueID}-${name}`}
		class:offset={menuOpen || (selected && selected.length) || focusedInput}
	>
		<span class="field-label">{name}</span>
	</label>

	<select
		{name}
		bind:value={selected}
		aria-hidden="true"
		tabindex="-1"
		class="visually-hidden"
	>
		{#each data as { label, value }}
			<option {value}>{label}</option>
		{/each}
	</select>

	<div class="autocomplete">
		<input
			aria-controls={`autocomplete-options--${uniqueID}-${name}`}
			autocapitalize="none"
			type="text"
			autocomplete="off"
			aria-autocomplete="list"
			role="combobox"
			id={`${uniqueID}-${name}`}
			aria-expanded="false"
			name={`autocomplete-${uniqueID}`}
			on:keyup={handleKeyUp}
			on:keydown={handleKeyDown}
			on:focus={handleInputFocus}
			on:blur={(focusedInput = false)}
			bind:value={textInput}
			bind:this={inputElement}
			on:click={handleInputClick}
		/>

		<ul
			id={`autocomplete-options--${uniqueID}-${name}`}
			role="listbox"
			class:hidden={!menuOpen}
		>
			{#if filteredData.length}
				{#each filteredData as { label, value }, i}
					<li
						role="option"
						tabindex="-1"
						aria-selected={i === highlightedIndex}
						data-option-value={value}
						id={`autocomplete_${i}`}
						bind:this={optionElements[i]}
						on:click={() => {
							handleOptionSelect(value, label);
						}}
						on:keydown={(event) => handleOptionKeydown(event, value, label)}
					>
						{label}
					</li>
				{/each}
			{:else}
				<li class="disabled" tabindex="-1">Sorry, no options match</li>
			{/if}
		</ul>

		<div aria-live="polite" role="status" class="visually-hidden">
			{resultCount} results available
		</div>
		{#if clearButton === true && textInput && textInput.length}
			<button
				on:click={clearAutocomplete}
				aria-label="clear autocomplete search"
			>
				<Close width="16px" height="16px" />
			</button>
		{/if}
	</div>
</div>

<style>
	.field {
		position: relative;
	}
	.autocomplete [role="listbox"] {
		max-height: 12em;
		overflow-y: scroll;
		-webkit-overflow-scrolling: touch;
	}

	.hidden {
		display: none;
	}

	label {
		font-size: 1rem;
		font-weight: 400;
		line-height: 1;
		position: absolute;
		top: 0;
		left: 0;
		z-index: var(--z-top);
		transform: translate(0.5rem, 1.2rem) scale(1);
		transition: color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms,
			transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
		padding: 0 0.5rem;
		background-color: var(--color-bg);
		transform-origin: 0px 0px;
		color: rgba(var(--fg-rgb), 0.54);
	}

	label.offset {
		transform: translate(0.5rem, -0.4rem) scale(0.75);
		transition: color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms,
			transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
		color: var(--primary);
	}

	.visually-hidden {
		border: 0 !important;
		clip: rect(0 0 0 0) !important;
		height: 1px !important;
		margin: -1px !important;
		overflow: hidden !important;
		padding: 0 !important;
		position: absolute !important;
		width: 1px !important;
	}

	.autocomplete {
		position: relative;
		display: flex;
	}

	.autocomplete [type="text"] {
		-webkit-appearance: none;
		border-radius: 4px;
		box-sizing: border-box;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
		width: 100%;
		font-size: inherit;
		font-family: inherit;
		line-height: 1.25;
		padding: 1rem;
		border: 1px solid var(--gray-style, #ccc);
		background-color: var(--color-bg);
		color: var(--color-fg);
	}

	input:focus {
		border: 1px solid var(--primary);
	}

	.autocomplete [role="listbox"] {
		margin: 0;
		max-height: 12em;
		overflow-y: auto;
		overflow-y: scroll;
		-webkit-overflow-scrolling: touch;
		position: relative;
		font-size: 100%;
		padding: 0;
		position: absolute;
		top: 2.4em;
		width: 100%;
		min-width: max-content;
		background-color: var(--color-bg);
		border-radius: 4px;
		box-sizing: border-box;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
		z-index: var(--z-overlay);
		border: 1px solid var(--gray-style, #ccc);
		box-shadow: 0px 5px 5px -3px rgba(var(--fg-rgb), 0.2),
			0px 8px 10px 1px rgba(var(--fg-rgb), 0.14),
			0px 3px 14px 2px rgba(var(--fg-rgb), 0.12);
	}

	.autocomplete [role="option"],
	.autocomplete li {
		line-height: 1.5em;
		padding: 0.5em;
		display: block;
		outline: 0;
		margin: 0;
		cursor: pointer;
	}

	.autocomplete [role="option"]:hover {
		background-color: rgba(var(--fg-rgb), 0.08);
	}

	.autocomplete [role="option"][aria-selected="true"] {
		background-color: rgba(var(--fg-rgb), 0.08);
	}

	.autocomplete li.disabled {
		font-size: 0.8rem;
		text-transform: uppercase;
		color: rgba(var(--fg-rgb), 0.8);
		cursor: initial;
	}

	button {
		border-radius: 50%;
		position: absolute;
		right: 0;
		top: 0;
		margin-right: 0.5rem;
		transform: translate(0, 60%);
		display: flex;
		align-items: center;
		justify-items: center;
		padding: 0.3rem;
		background-color: transparent;
		color: var(--color-fg);
	}

	button:hover {
		background-color: rgba(var(--fg-rgb), 0.04);
	}
</style>
