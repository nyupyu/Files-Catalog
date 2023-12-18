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
		for (const itemName in data) {
			let newItem = document.createElement('div');
			newItem.classList.add('item');
			newItem.innerHTML = `<p>${itemName}</p>`;
			newItem.addEventListener('click', () => handleItemClick(data[itemName]));
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
		FILES_CATALOG.innerHTML = ''; // Wyczyść zawartość przed dodaniem nowych elementów

		if (Array.isArray(item)) {
			// Jeśli to jest tablica, to są to pliki w folderze
			buildFiles(item);
		} else if (typeof item === 'object') {
			// Jeśli to jest obiekt, to jest to kolejny folder
			buildFolder(item);
		}
	}

	loadFileStructure();
}

document.addEventListener('DOMContentLoaded', () => {
	filesCatalog();
});
