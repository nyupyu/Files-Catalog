// front.js

// Import pliku JSON
fetch(window.jsonFilePath)
	.then(response => response.json())
	.then(data => {
		// Tutaj możesz pracować z danymi JSON
		console.log(data);
	})
	.catch(error => console.error('Błąd podczas ładowania pliku JSON:', error));
