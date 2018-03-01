chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (sender.id !== chrome.runtime.id) {
		return;
	}
	if (message.action === "getGroups") {
		Page.getGroups(window.document).then((groups) => {
			sendResponse(groups);
		});
		// Need to return true to be able to use sendResponse asynchronously
		return true;
	}
});
