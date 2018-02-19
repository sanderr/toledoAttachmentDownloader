const Page = (() => {

	const _executeScript = (fn, callback) => {
		chrome.tabs.executeScript({
			code: "(" + fn + ")();"
		}, (results) => {
			callback(results[0])
		});
	};

	const _getUnsafeResourceGroups = (callback) => {
		_executeScript(() => {
			const baseUrl = window.document.baseURI.replace(/((https:\/\/)?[^/]*)\/.*/g, "$1")
			const result = [];
			const groups = document.querySelectorAll(".read");
			groups.forEach((group) => {
				const groupName = group.querySelector("span[style]").innerText;
				const resources = group.querySelectorAll(".details .detailsValue ul.attachments > li > a");
				const groupObject = {
					groupName: groupName,
					resources: []
				};
				resources.forEach((resource) => {
					const url = resource.href.match(/^https?:\/\//) ? resource.href : baseUrl + resource.href.replace(/^\/?/, "/");
					groupObject.resources.push({
						name: resource.innerText,
						url: url
					});
				});
				result.push(groupObject);
			});
			return result;
		}, callback);
	};

	const _getResourceGroups = (callback) => {
		const groups = _getUnsafeResourceGroups((groups) => {
			const result = [];
			groups.forEach((group) => {
				const groupObject = {
					groupName: Util.convertFilenameSafe(group.groupName),
					resources: []
				};
				group.resources.forEach((resource) => {
					groupObject.resources.push({
						name: Util.convertFilenameSafe(resource.name),
						url: resource.url
					});
				});
				result.push(groupObject);
			});
			callback(result);
		});
	};

	return {
		/**
		 * Executes a script in the context of the page.
		 * @param {Function} fn The script to execute.
		 * @param {Function} callback A function taking as a parameter the return value of the execution.
		 */
		executeScript(fn, callback) {
			return _executeScript(fn, callback);
		},
		/**
		 * Returns a list of resource groups and all their data.
		 * @return {Object[]} list List of resource groups.
		 * @return {String} list[].groupName Name of the group.
		 * @return {String} list[].resources Resources belonging to the group.
		 * @return {String} list[].resources[].name Name of the resource.
		 * @return {String} list[].resources[].url Absolute url of this resource.
		 */
		getResourceGroups(callback) {
			return _getResourceGroups(callback);
		}
	}; //return

})(); //Page
