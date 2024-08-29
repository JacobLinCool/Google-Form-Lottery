<script lang="ts">
	import { parseFile } from '$lib/parse';
	import Viewer from './Viewer.svelte';

	let files: FileList;
	let headers: string[] = [];
	let data: string[][] = [];
	let selected: number[] = [];

	async function upload() {
		[headers, data] = await parseFile(files[0]);
		console.log(headers, data);
	}

	let n = 1;
	function select() {
		const indices = Array.from({ length: data.length }, (_, i) => i);
		indices.sort(() => Math.random() - 0.5);
		selected = indices.slice(0, n);
	}
</script>

<svelte:head>
	<title>Google Form Lottery</title>
</svelte:head>

<div class="p-4 h-full w-full flex flex-col items-center">
	<div class="prose">
		<h1>Google Form Lottery</h1>
		<p>Upload a ZIP/CSV file to select some random winners.</p>
		<input
			class="file-input file-input-primary w-full max-w-xs"
			type="file"
			accept=".csv,.zip"
			bind:files
			on:change={upload}
		/>
	</div>

	{#if headers.length > 0}
		<div class="py-4">
			<Viewer {headers} {data} {selected} />
		</div>

		<div class="prose">
			<h2>Select {n} random winner{n > 1 ? 's' : ''}</h2>
			<input
				class="range range-primary range-xs"
				type="range"
				min="0"
				max={data.length}
				bind:value={n}
			/> <br />
			<button class="btn btn-primary" on:click={select}>Select</button>
		</div>
	{/if}
</div>
