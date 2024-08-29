<script lang="ts">
	export let headers: string[] = [];
	export let data: string[][] = [];
	export let selected: number[] = [];

	const maxLen = headers.map((header, i) =>
		data.map((row) => row[i].length).reduce((a, b) => Math.max(a, b), 0)
	);
	let masks = Object.fromEntries(headers.map((header, i) => [i, [1, 0] as [number, number]]));

	function mask(text: string, i: number) {
		const [start, end] = masks[i];
		if (text.length <= start + end) {
			return text;
		}
		return (
			text.substring(0, start) +
			'*'.repeat(text.length - start - end) +
			text.substring(text.length - end)
		);
	}
</script>

<div class="overflow-x-auto">
	<table class="table">
		<thead>
			<tr>
				<th>#</th>
				{#each headers as header}
					<th>{header}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each data as row, i}
				<tr class:font-bold={selected.includes(i)} class:text-success={selected.includes(i)}>
					<td>{i + 1}</td>
					{#each row as cell, j}
						<td>{j in masks ? mask(cell, j) : cell}</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<div class="p-4">
	<h2 class="font-bold">Masking</h2>
	<div class="grid grid-cols-3 gap-4">
		{#each headers as header, i}
			<span>{header}</span>
			<input
				class="range range-secondary range-xs"
				type="range"
				min="0"
				max={maxLen[i] - masks[i][1]}
				bind:value={masks[i][0]}
				on:change={() => (masks = masks)}
			/>
			<input
				class="range range-secondary range-xs"
				type="range"
				min="0"
				max={maxLen[i] - masks[i][0]}
				bind:value={masks[i][1]}
				on:change={() => (masks = masks)}
			/>
		{/each}
	</div>
</div>
