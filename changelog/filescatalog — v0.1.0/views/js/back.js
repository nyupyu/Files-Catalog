document.addEventListener('DOMContentLoaded', function () {
	var pathInput = document.getElementById('filescatalog_path');
	if (pathInput) {
		pathInput.addEventListener('input', function () {
			pathInput.value = pathInput.value.trim();
		});
	}
});
