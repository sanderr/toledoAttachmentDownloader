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

	const _downloadFiles = (files, zipName) => {
		return new Promise((resolve, reject) => {
			const zip = new JSZip();
			const promises = files.map((file) => {
				return _downloadResource(file.url).then((buffer) => {
					zip.file(file.group + "/" + file.name, buffer, { binary: true });
				});
			});
			Promise.all(promises).then(() => {
				zip.generateAsync({ type: "blob" }).then((content) => {
					saveAs(content, zipName + ".zip");
					resolve();
				});
			});
		});
	};

	return {
		getDom(url) {
			return _getDom(url);
		},
		downloadResource(url) {
			return _downloadResource(url);
		},
		/**
		 * Download the requested files into a zip.
		 * @param {Object[]} files The files to download.
		 * @param {String} files[].name The name of this file.
		 * @param {String} files[].group The name of the group this file belongs to.
		 * @param {String} files[].url The url this file can be downloaded from.
		 * @param {String} zipName The name of the zip file that will be downloaded.
		 */
		downloadFiles(files, zipName) {
			return _downloadFiles(files, zipName);
		}
	};

})();
