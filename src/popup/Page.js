const Page = (() => {

	const _executeScript = (fn) => {
		return new Promise((resolve, reject) => {
			chrome.tabs.executeScript({
				code: "(" + fn + ")();"
			}, (results) => {
				if (chrome.runtime.lastError || ! results || results.length === 0) {
					reject("Something went wrong.");
					return;
				}
				resolve(results[0]);
			});
		});
	};

	const _getPageTitle = () => {
		return new Promise((resolve, reject) => {
			const result = _executeScript(() => {
				const pageTitle = document.querySelector("#pageTitleText").firstElementChild.innerHTML;
				return pageTitle;
			});
			resolve(result);
		});
	};

	const _getUnsafeResourceGroups = () => {
		//TODO: send message and listen for response
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
			}).catch((err) => {
				reject(err);
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
		},
		/**
		 * Returns the page title
		 * @return {Promise} Promise with value the page title
		 * @return {String} string Page title.
		 */
		getPageTitle() {
			return _getPageTitle();
		}
	}; //return

})(); //Page
