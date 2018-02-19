const Downloader = (() => {

	const _downloadResource = (url) => {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.responseType = "arraybuffer";
			xhr.onreadystatechange = () => { 
				if (xhr.readyState === 4 && xhr.status === 200) {
					resolve(xhr.response);
				}
			}
			xhr.open("GET", url, true);
			xhr.send(null);
		});
	};

	return {
		downloadResource(url) {
			return _downloadResource(url);
		}
	};

})();
