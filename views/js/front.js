function filesCatalog() {
	const FOLDERS = document.getElementById('folders');
	const FILES = document.getElementById('files');
	const SAVED_DATA = [];
	const PATH_TO_FILE_DATA = [];
	const SERVER_PATH_TO_DOWNLOAD_FOLDER = 'https://qmtwjcpfur.cfolks.pl/pliki-do-pobrania/katalog/';
	const SERVER_PATH = 'https://qmtwjcpfur.cfolks.pl/modules/filescatalog';

	const IMAGE_PROPS = {
		pdf: { name: 'pdf', path: SERVER_PATH + '/./views/img/pdf.svg' },
		txt: { name: 'txt', path: SERVER_PATH + '/./views/img/txt.svg' },
		png: { name: 'png', path: SERVER_PATH + '/./views/img/png.svg' },
		doc: { name: 'doc', path: SERVER_PATH + '/./views/img/doc.svg' },
		jpg: { name: 'jpg', path: SERVER_PATH + '/./views/img/jpg.svg' },
		jpeg: { name: 'jpeg', path: SERVER_PATH + '/./views/img/jpg.svg' },
		xml: { name: 'xml', path: SERVER_PATH + '/./views/img/xml.svg' },
		xmls: { name: 'xmls', path: SERVER_PATH + '/./views/img/xml.svg' },
		xls: { name: 'xls', path: SERVER_PATH + '/./views/img/xls.svg' },
		csv: { name: 'csv', path: SERVER_PATH + '/./views/img/csv.svg' },
		zip: { name: 'zip', path: SERVER_PATH + '/./views/img/zip.svg' },
		file: { name: 'file', path: SERVER_PATH + '/./views/img/file.svg' },
	};

	async function loadFileStructure() {
		try {
			const response = await fetch(window.jsonFilePath);
			const DATA = await response.json();
			buildFolders(DATA);
			saveData(DATA);
		} catch (error) {
			console.error('Error loading JSON file:', error);
		}
	}

	function savePathData(path) {
		PATH_TO_FILE_DATA.push(path);
	}

	function generatePathToFile(value) {
		PATH_TO_FILE_DATA.push(value);
		let pathToFile = PATH_TO_FILE_DATA.toString();
		if (value.includes('.')) {
			PATH_TO_FILE_DATA.pop();
		}
		pathToFile = pathToFile.replaceAll(',', '/');
		pathToFile = SERVER_PATH_TO_DOWNLOAD_FOLDER + pathToFile;
		return pathToFile;
	}
	function buildBackButton() {
		const backButton = document.createElement('button');
		const text = '\u293A';
		backButton.setAttribute('id', 'back__button');
		backButton.textContent = text;
		backButton.addEventListener('click', () => goBack());
		return backButton;
	}
	function buildFolders(data) {
		for (const [key, value] of Object.entries(data)) {
			if (!isNaN(key)) {
				const newArray = [];
				newArray.push(value);
				buildFiles(newArray);
			} else {
				const newItem = document.createElement('div');
				const image = document.createElement('img');
				const title = document.createElement('p');
				newItem.classList.add('folder');
				image.setAttribute('src', SERVER_PATH + '/./views/img/folder.svg');
				image.setAttribute('alt', 'folder');
				image.classList.add('folder__img');
				title.classList.add('folder__text');
				title.textContent = key;
				newItem.appendChild(image);
				newItem.appendChild(title);
				newItem.addEventListener('click', () => {
					savePathData(key);
					handleItemClick(value);
				});
				FOLDERS.appendChild(newItem);
			}
		}
	}
	function buildFiles(data) {
		for (const file of data) {
			const newFile = document.createElement('div');
			const image = document.createElement('img');
			const title = document.createElement('p');
			const link = document.createElement('a');
			newFile.classList.add('file');
			for (const [key, value] of Object.entries(IMAGE_PROPS)) {
				if (file.includes('.' + value.name)) {
					image.setAttribute('src', value.path);
					image.setAttribute('alt', value.name);
					break;
				} else if (!file.includes('.' + value.name)) {
					image.setAttribute('src', IMAGE_PROPS.file.path);
					image.setAttribute('alt', IMAGE_PROPS.file.name);
				}
			}
			image.classList.add('file__img');
			title.classList.add('file__text');
			title.textContent = file;
			link.classList.add('file__link');
			link.setAttribute('href', generatePathToFile(file));
			link.setAttribute('target', '_blank');
			link.setAttribute('download', file);
			link.appendChild(image);
			link.appendChild(title);
			newFile.appendChild(link);
			FILES.appendChild(newFile);
		}
	}

	function handleItemClick(data) {
		saveData(data);
		FOLDERS.innerHTML = '';
		FOLDERS.appendChild(buildBackButton());
		FILES.innerHTML = '';
		if (Array.isArray(data)) {
			buildFiles(data);
		} else if (typeof data === 'object') {
			buildFolders(data);
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
	FOLDERS.appendChild(buildBackButton());
	loadFileStructure();
}

document.addEventListener('DOMContentLoaded', filesCatalog);
