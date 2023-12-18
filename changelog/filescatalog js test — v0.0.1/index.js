let DATA = {};

async function loadFileStructure() {
	try {
		const response = await fetch('./data.json');
		DATA = await response.json();
		console.log(DATA);
		buildFolderTree(DATA, document.getElementById('folderTree'));
	} catch (error) {
		console.error('Błąd ładowania pliku JSON:', error);
		return null;
	}
}

function buildFolderTree(data, parentElement, depth = 0) {
	const ul = document.createElement('ul');

	if (depth >= 3) {
		const li = document.createElement('li');
		li.textContent = '...'; // Możesz dostosować komunikat informacyjny
		ul.appendChild(li);
		parentElement.appendChild(ul);
		return;
	}

	for (const key in data) {
		const isFolder = !Array.isArray(data[key]);
		const li = document.createElement('li');

		if (isFolder) {
			li.classList.add('folder');
			li.textContent = key;
			li.addEventListener('click', async () => {
				if (li.dataset.loaded) {
					toggleFolder(li);
				} else {
					await loadFolderData(data[key], li, depth + 1);
				}
			});
		} else {
			// Leaf node (file)
			li.textContent = data[key];
		}

		ul.appendChild(li);
	}

	parentElement.appendChild(ul);
}

async function loadFolderData(folderData, folderElement, depth) {
	const ul = document.createElement('ul');

	for (const key in folderData) {
		const isFolder = !Array.isArray(folderData[key]);
		const li = document.createElement('li');

		if (isFolder) {
			li.classList.add('folder');
			li.textContent = key;
			li.addEventListener('click', async () => {
				if (li.dataset.loaded) {
					toggleFolder(li);
				} else {
					await loadFolderData(folderData[key], li, depth + 1);
				}
			});
		} else {
			// Leaf node (file)
			li.textContent = folderData[key];
		}

		ul.appendChild(li);
	}

	folderElement.appendChild(ul);
	folderElement.dataset.loaded = true;
}

function toggleFolder(folderElement) {
	const ul = folderElement.querySelector('ul');
	if (ul) {
		// Folder is already open, so close it
		ul.style.display = ul.style.display === 'none' ? 'block' : 'none';
	}
}

document.addEventListener('DOMContentLoaded', () => {
	loadFileStructure();
});
