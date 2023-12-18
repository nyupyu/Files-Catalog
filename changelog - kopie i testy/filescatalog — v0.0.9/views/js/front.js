function filesCatalog() {
	let DATA = [];

	async function loadFileStructure() {
		try {
			const response = await fetch(window.jsonFilePath);
			DATA = await response.json();
			console.log(DATA);
		} catch (error) {
			console.error('Błąd ładowania pliku JSON:', error);
			return null;
		}
	}

	async function initializeFileList() {
		await loadFileStructure();

		if (DATA) {
			const container = document.getElementById('filesCatalog');
			createFileList(container, DATA);
		}
	}

	function createFileList(container, data, path = []) {
		const ul = document.createElement('ul');

		for (const key in data) {
			const li = document.createElement('li');

			if (typeof data[key] === 'object') {
				// It's a folder
				li.className = 'filesCatalog__folder';
				li.textContent = key;
				li.addEventListener('click', () => toggleFolder(li, path.concat(key), data[key]));
				const subList = createFileList(li, data[key], path.concat(key));
				li.appendChild(subList);
			} else {
				// It's a file
				li.className = 'filesCatalog__file';
				li.textContent = key;
				li.addEventListener('click', () => alert(`Open file: ${path.concat(key).join('/')}`));
			}

			ul.appendChild(li);
		}

		container.appendChild(ul);
		return ul;
	}

	function toggleFolder(element, path, data) {
		const subList = element.querySelector('ul');

		if (subList) {
			// Folder is already open, close it
			subList.remove();
		} else {
			// Folder is closed, open it
			createFileList(element, data, path);
		}
	}

	// Inicjalizacja listy po załadowaniu struktury plików
	initializeFileList();
}
filesCatalog();
