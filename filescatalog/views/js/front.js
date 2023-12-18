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
			const response = await fetch(window.jsonFilePath);
			const DATA = await response.json();
			buildFolder(DATA);
			saveData(DATA);
		} catch (error) {
			console.error('Error loading JSON file:', error);
		}
	}

	function savePathData(path) {
		PATH_TO_FILE_DATA.push(path);
		console.log('SAVE PATH TO DATA', PATH_TO_FILE_DATA);
	}

	function generatePathToFile(value) {
		PATH_TO_FILE_DATA.push(value);
		let pathToFile = PATH_TO_FILE_DATA.toString();
		console.log('GENERATE ', pathToFile);
		if (value.includes('.')) {
			PATH_TO_FILE_DATA.pop();
		}
		pathToFile = pathToFile.replaceAll(',', '/');
		pathToFile = pathToFile.replaceAll(' ', '%');
		pathToFile = SERVER_PATH_TO_DOWNLOAD_FOLDER + pathToFile;
		return pathToFile;
	}

	function buildFolder(data) {
		for (const [key, value] of Object.entries(data)) {
			const newItem = document.createElement('a');
			if (!isNaN(key)) {
				newItem.setAttribute('href', generatePathToFile(value));
				newItem.setAttribute('target', '_blank');
				newItem.setAttribute('download', value);
				if (value.includes('pdf')) newItem.classList.add('pdf');
				newItem.classList.add('file');
				newItem.innerHTML = `<p>${value}</p>`;
				FILES.appendChild(newItem);
			} else {
				newItem.classList.add('folder');
				newItem.innerHTML = `<p>${key}</p>`;
				newItem.addEventListener('click', () => {
					savePathData(key);
					handleItemClick(value);
				});
				FOLDERS.appendChild(newItem);
			}
		}
	}

	function buildFiles(files) {
		const newFile = document.createElement('a');
		for (const file of files) {
			newFile.setAttribute('href', generatePathToFile(file));
			newFile.setAttribute('target', '_blank');
			newFile.setAttribute('download', file);
			if (file.includes('pdf')) newFile.classList.add('pdf');
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
		SAVED_DATA.push(data);
	}

	function goBack() {
		if (SAVED_DATA.length > 1) {
			SAVED_DATA.pop();
			PATH_TO_FILE_DATA.pop();
			console.log('GO BACK ', PATH_TO_FILE_DATA);
			handleItemClick(SAVED_DATA.pop());
		}
	}

	BACK_BUTTON.addEventListener('click', goBack);
	loadFileStructure();
}

document.addEventListener('DOMContentLoaded', filesCatalog);
