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
		const _downloadZip = (pageTitle) => {
			Downloader.downloadFiles(files, pageTitle).then(() => {
				clearInfo();
			});
		};

		showInfo("Downloading... This might take a while.");
		Page.getPageTitle().then((title) => _downloadZip(title))
			.catch((err) => _downloadZip("toledo"));
	};

	const toTreeItems = (groups, pathAccumulator) => {
		const items = [];
		groups.forEach((group) => {
			const children = [];
			group.resources.forEach((resource) => {
				children.push({
					text: resource.name,
					data: {
						name: resource.name,
						path: pathAccumulator ? pathAccumulator + "/" + group.groupName : group.groupName,
						url: resource.url
					}
				});
			});
			if (group.subGroups) {
				toTreeItems(group.subGroups, group.groupName).forEach((subGroup) => {
					children.push(subGroup);
				});
			}
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

	showInfo("Please wait a moment...");
	Page.getResourceGroups().then((groups) => {
		clearInfo();
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

		const buttonsAll = $("#button-download-all");
		const buttonsSelected = $("#button-download-selected");

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

		buttonsAll.show();
		buttonsSelected.show();

	}).catch((err) => {
		showWarning(err);
	});

} //window.onload()
