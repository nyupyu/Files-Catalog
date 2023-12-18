function filesCatalog() {
	const FILES_CATALOG = document.getElementById('filesCatalog');
	const FOLDERS = document.getElementById('folders');
	const FILES = document.getElementById('files');
	const BACK_BUTTON = document.getElementById('backButton');

	const SAVED_DATA = [];
	const PATH_TO_FILE_DATA = [];
	const SERVER_PATH_TO_DOWNLOAD_FOLDER = 'https://qmtwjcpfur.cfolks.pl/pliki-do-pobrania/katalog/';

	async function loadFileStructure() {
		try {
			const response = await fetch('./data.json');
			const DATA = await response.json();
			buildFolder(DATA);
			saveData(DATA);
		} catch (error) {
			console.error('Error loading JSON file:', error);
		}
	}

	function generatePathToFile() {
		let pathToFile = PATH_TO_FILE_DATA.toString();
		pathToFile = pathToFile.replaceAll(',', '/');
		pathToFile = pathToFile.replaceAll(' ', '%');
		pathToFile = SERVER_PATH_TO_DOWNLOAD_FOLDER + pathToFile;
		console.log(pathToFile);
	}

	function savePathData(path) {
		PATH_TO_FILE_DATA.push(path);
		generatePathToFile();
		if (path.includes('.')) {
			PATH_TO_FILE_DATA.pop();
			// console.log(PATH_TO_FILE_DATA);
		}
	}
	function buildFolder(data) {
		for (const [key, value] of Object.entries(data)) {
			const newItem = document.createElement('a');
			if (!isNaN(key)) {
				newItem.addEventListener('click', () => {
					savePathData(value);
				});
				if (value.includes('pdf')) newItem.classList.add('pdf');
				newItem.classList.add('file');
				newItem.innerHTML = `<p>${value}</p>`;
				FILES.appendChild(newItem);
			} else {
				newItem.classList.add('folder');
				newItem.innerHTML = `<p>${key}</p>`;
				newItem.addEventListener('click', () => {
					handleItemClick(value);
					savePathData(key);
				});
				FOLDERS.appendChild(newItem);
			}
		}
	}

	function buildFiles(files) {
		for (const file of files) {
			const newFile = document.createElement('a');
			newFile.addEventListener('click', () => {
				savePathData(file);
			});
			if (file.includes('pdf')) newFile.classList.add('pdf');
			newFile.classList.add('file');
			newFile.innerHTML = `<p>${file}</p>`;
			FILES.appendChild(newFile);
		}
	}

	function handleItemClick(data, key) {
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
		SAVED_DATA.push(data);
	}

	function goBack() {
		if (SAVED_DATA.length > 1) {
			SAVED_DATA.pop();
			PATH_TO_FILE_DATA.pop();
			handleItemClick(SAVED_DATA.pop());
		}
	}

	BACK_BUTTON.addEventListener('click', goBack);
	loadFileStructure();
}

document.addEventListener('DOMContentLoaded', filesCatalog);
