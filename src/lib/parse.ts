import papa from 'papaparse';
import { unzipSync, strFromU8 } from 'fflate';
import type { Unzipped } from 'fflate';
import { showError } from './error';

export async function parseFile(file: File) {
	try {
		if (file.name.endsWith('.zip')) {
			const content = await extractCsvFromZip(file);
			return parseCSV(content);
		}
		if (file.name.endsWith('.csv')) {
			const content = await file.text();
			return parseCSV(content);
		}
		throw new Error(`Unsupported file type: ${file.type}`);
	} catch (error) {
		if (error instanceof Error) {
			showError(error.message);
		}
		console.error(error);
		return [];
	}
}

async function extractCsvFromZip(file: File): Promise<string> {
	const zipData = await file.arrayBuffer();
	const unzippedFiles: Unzipped = unzipSync(new Uint8Array(zipData));

	const csvFileName = Object.keys(unzippedFiles).find((fileName) => fileName.endsWith('.csv'));
	if (!csvFileName) {
		throw new Error('No CSV file found in the zip archive');
	}

	const csvFileContent = unzippedFiles[csvFileName];
	const csvContent = strFromU8(csvFileContent);
	return csvContent;
}

async function parseCSV(csvContent: string): Promise<[string[], string[][]]> {
	return new Promise((resolve, reject) => {
		papa.parse<string[]>(csvContent, {
			header: false, // We want to manually handle the header and rows
			skipEmptyLines: true,
			complete: (results) => {
				const data = results.data;

				if (data.length > 0) {
					const headers = data[0]; // First row as header
					const rows = data.slice(1); // Remaining rows as data
					resolve([headers, rows]);
				} else {
					reject(new Error('CSV content is empty or malformed.'));
				}
			},
			error: (error: unknown) => {
				reject(error);
			}
		});
	});
}
