const Page = (() => {

	const _getGroupName = (group) => {
		let groupNameElement = group.querySelector(".item span[style]");
		if (! groupNameElement) {
			groupNameElement = group.querySelector(".item a");
		}
		return groupNameElement ? groupNameElement.innerText : "unknown";
	};

	const _getResources = (group) => {
		return group.querySelectorAll(".details .detailsValue ul.attachments > li > a");
	};

	const _getSubGroups = (group) => {
		return new Promise((resolve, reject) => {
			const subDir = group.querySelector(".item a");
			if (! subDir) {
				reject();
				return;
			}
			const url = subDir.href;
			const xhr = new XMLHttpRequest();
			xhr.onreadystatechange = () => { 
				if (xhr.readyState === 4 && xhr.status === 200) {
					parser = new DOMParser();
					doc = parser.parseFromString(xhr.response, "text/html");
					_getGroups(doc).then((result) => {
						resolve(result);
					}).catch((err) => {
						reject(err);
					})
				}
			}
			xhr.open("GET", url, true);
			xhr.send(null);
		});
	};

	const _getGroups = (doc) => {
		return new Promise((resolve, reject) => {
			if (! doc) {
				reject();
			}
			const baseUrl = doc.baseURI.replace(/((https:\/\/)?[^/]*)\/.*/g, "$1")
			const result = [];
			const groups = doc.querySelector("#content_listContainer").children;
			if (! groups) {
				reject();
			}
			const promises = Array.from(groups).map((group) => {
				return new Promise((res, rej) => {
					const groupName = _getGroupName(group);
					const resources = _getResources(group);
					const groupObject = {
						groupName: groupName,
						resources: []
					};
					if (! resources) {
						res(groupObject);
					}
					resources.forEach((resource) => {
						const url = resource.href.match(/^https?:\/\//) ? resource.href : baseUrl + resource.href.replace(/^\/?/, "/");
						groupObject.resources.push({
							name: resource.innerText,
							url: url
						});
					});
					_getSubGroups(group).then((subGroups) => {
						groupObject.subGroups = subGroups;
						res(groupObject);
					}).catch((err) => {
						res(groupObject);
					});
				});
			});
			Promise.all(promises).then((results) => {
				resolve(results);
			});
		});
	};

	return {
		/**
		 * Returns a list of resource groups and all their data, extracted from the document.
		 * @param {Document} doc The document to search.
		 * @return {Promise} Promise with value a list of resource groups.
		 * @return {Object[]} list List of resource groups.
		 * @return {String} list[].groupName Name of the group.
		 * @return {String} list[].resources Resources belonging to the group.
		 * @return {String} list[].resources[].name Name of the resource.
		 * @return {String} list[].resources[].url Absolute url of this resource.
		 * @return {Object} [list[].subGroup] Subgroup for this group.
		 */
		getGroups(doc) {
			return _getGroups(doc);
		}
	}; //return

})(); //Page
