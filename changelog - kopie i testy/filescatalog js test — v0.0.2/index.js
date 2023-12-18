function filesCatalog() {
	const FILES_CATALOG = document.getElementById('filesCatalog');
	const FOLDERS = document.getElementById('folders');
	const FILES = document.getElementById('files');
	const BACK_BUTTON = document.getElementById('backButton');

	const savedData = [];

	async function loadFileStructure() {
		try {
			const response = await fetch('./data.json');
			const data = await response.json();

			buildFolder(data);
			saveData(data);
		} catch (error) {
			console.error('Error loading JSON file:', error);
		}
	}

	function buildFolder(data) {
		for (const [key, value] of Object.entries(data)) {
			const newItem = document.createElement('div');
			if (!isNaN(key)) {
				if (value.includes('pdf')) newItem.classList.add('pdf');
				newItem.classList.add('file');
				newItem.innerHTML = `<p>${value}</p>`;
				FILES.appendChild(newItem);
			} else {
				newItem.classList.add('folder');
				newItem.innerHTML = `<p>${key}</p>`;
				newItem.addEventListener('dblclick', () => handleItemClick(value));
				FOLDERS.appendChild(newItem);
			}
		}
	}

	function buildFiles(files) {
		for (const file of files) {
			const newFile = document.createElement('div');
			if (value.includes('pdf')) newItem.classList.add('pdf');
			newFile.classList.add('file');
			newFile.innerHTML = `<p>${file}</p>`;
			FILES.appendChild(newFile);
		}
	}

	function handleItemClick(data) {
		saveData(data);
		FOLDERS.innerHTML = '';
		FILES.innerHTML = '';

		if (Array.isArray(data)) {
			buildFiles(data);
		} else if (typeof data === 'object') {
			buildFolder(data);
		} else {
			buildFiles([data]);
		}
	}

	function saveData(data) {
		savedData.push(data);
		console.log(savedData);
	}

	function goBack() {
		if (savedData.length > 1) {
			savedData.pop();
			handleItemClick(savedData.pop());
		}
	}

	BACK_BUTTON.addEventListener('click', goBack);
	loadFileStructure();
}

document.addEventListener('DOMContentLoaded', filesCatalog);
