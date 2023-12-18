function filesCatalog() {
	const FILES_CATALOG = document.getElementById('filesCatalog');
	let DATA = {};

	async function loadFileStructure() {
		try {
			const response = await fetch('./data.json');
			DATA = await response.json();
			buildFolder(DATA);
		} catch (error) {
			console.error('Błąd ładowania pliku JSON:', error);
			return null;
		}
	}
	function buildFolder(data) {
		for (const [key, value] of Object.entries(data)) {
			let newItem = document.createElement('div');
			newItem.classList.add('item');

			if (!isNaN(key)) {
				// Jeśli klucz jest liczbą, użyj wartości jako nazwy pliku
				newItem.innerHTML = `<p>${value}</p>`;
				newItem.addEventListener('click', () => handleItemClick(value));
			} else {
				// W przeciwnym razie użyj klucza jako nazwy folderu
				newItem.innerHTML = `<p>${key}</p>`;
				newItem.addEventListener('click', () => handleItemClick(value));
			}

			FILES_CATALOG.appendChild(newItem);
		}
	}

	function buildFiles(files) {
		for (const file of files) {
			let newFile = document.createElement('div');
			newFile.classList.add('file');
			newFile.innerHTML = `<p>${file}</p>`;
			FILES_CATALOG.appendChild(newFile);
		}
	}

	function handleItemClick(item) {
		FILES_CATALOG.innerHTML = '';

		if (Array.isArray(item)) {
			buildFiles(item);
		} else if (typeof item === 'object') {
			buildFolder(item);
		} else {
			buildFiles([item]);
		}
	}

	loadFileStructure();
}

document.addEventListener('DOMContentLoaded', () => {
	filesCatalog();
});
