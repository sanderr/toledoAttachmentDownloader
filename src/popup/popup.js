window.onload = () => {

	const showInfo = (info) => {
		$("#info").text(info);
		$("#info").show();
	};

	const clearInfo = () => {
		$("#info").text("");
		$("#info").hide();
	};

	const showWarning = (warning) => {
		document.querySelector("#menu").innerHTML = "<p>" + warning + "</p>";
	};

	const downloadZip = (files) => {
		showInfo("Downloading... This might take a while.");
		Downloader.downloadFiles(files, "toledo").then(() => {
			clearInfo();
		});
	};

	const toTreeItems = (groups) => {
		const items = [];
		groups.forEach((group) => {
			const children = [];
			group.resources.forEach((resource) => {
				children.push({
					text: resource.name,
					data: {
						name: resource.name,
						group: group.groupName,
						url: resource.url
					}
				});
			});
			if (children.length === 0) {
				return;
			}
			items.push({
				text: group.groupName,
				children: children
			});
		});
		return items;
	};

	Page.getResourceGroups().then((groups) => {
		if (groups.length === 0) {
			showWarning("No resources found on this page.");
			return;
		}
		$("#tree").jstree({
			plugins : [ "checkbox" ],
			core: {
				check_callback: true,
				data: [{
					id: "root",
					name: "/",
					state : {
						opened : true,
						selected : true
					},
					children: toTreeItems(groups)
				}],
				worker: false,
				themes: {
					icons: false
				}
			},
		});


		/*
		 * Buttons
		 */

		const buttonsAll = document.querySelector("#button-download-all");
		const buttonsSelected = document.querySelector("#button-download-selected");

		buttonsAll.onclick = () => {
			const files = [];
			groups.forEach((group) => {
				group.resources.forEach((resource) => {
					files.push({
						name: resource.name,
						group: group.groupName,
						url: resource.url
					});
				});
			});
			downloadZip(files);
		};

		buttonsSelected.onclick = () => {
			const selected = $("#tree").jstree("get_bottom_selected", true);
			const files = selected.map((treeItem) => {
				return treeItem.data;
			});
			downloadZip(files);
		};

	}).catch((err) => {
		showWarning(err);
	});

} //window.onload()
