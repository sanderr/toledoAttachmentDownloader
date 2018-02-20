const Page = (() => {

	const _executeScript = (fn) => {
		return new Promise((resolve, reject) => {
			chrome.tabs.executeScript({
				code: "(" + fn + ")();"
			}, (results) => {
				resolve(results[0]);
			});
		});
	};

	const _getUnsafeResourceGroups = () => {
		return _executeScript(() => {
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
		});
	};

	const _getResourceGroups = () => {
		return new Promise((resolve, reject) => {
			_getUnsafeResourceGroups().then((groups) => {
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
				resolve(result);
			});
		});
	};

	return {
		/**
		 * Executes a script in the context of the page.
		 * @param {Function} fn The script to execute.
		 * @return {Promise} A promise with value the return value of the execution.
		 */
		executeScript(fn) {
			return _executeScript(fn);
		},
		/**
		 * Returns a list of resource groups and all their data.
		 * @return {Promise} Promise with value a list of resource groups.
		 * @return {Object[]} list List of resource groups.
		 * @return {String} list[].groupName Name of the group.
		 * @return {String} list[].resources Resources belonging to the group.
		 * @return {String} list[].resources[].name Name of the resource.
		 * @return {String} list[].resources[].url Absolute url of this resource.
		 */
		getResourceGroups() {
			return _getResourceGroups();
		}
	}; //return

})(); //Page
