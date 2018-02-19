window.onload = () => {

	const zip = new JSZip();

	Page.getResourceGroups().then((groups) => {
		const promises = groups.map((group) => {
			const groupPromises = group.resources.map((resource) => {
				return Downloader.downloadResource(resource.url).then((buffer) => {
					zip.file(group.groupName + "/" + resource.name, buffer, { binary: true });
				});
			});
			return Promise.all(groupPromises);
		});
		Promise.all(promises).then(() => {
			console.log(promises);
			zip.generateAsync({ type: "blob" }).then((content) => {
				saveAs(content, "toledo.zip");
			});
		});
	});

} //window.onload()
