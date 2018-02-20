window.onload = () => {

	const zip = new JSZip();

	Page.getResourceGroups().then((groups) => {
		if (groups.length > 0) {
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
					console.log(content);
					saveAs(content, "toledo.zip");
				});
			});
		} else {
			document.querySelector("body p").innerText = "WARNING: No resources found on this page.";
		}
	});

} //window.onload()
