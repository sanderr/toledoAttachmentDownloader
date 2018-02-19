const Util = (() => {

	const _convertFilenameSafe = (string) => {
		let result = string.replace(/^\s*/g, "");
		result = result.replace(/[ .]*$/g, "");
		result = result.replace(/[:<>"\\/|?*]/g, "_");
		return result;
	};

	return {
		convertFilenameSafe(string) {
			return _convertFilenameSafe(string);
		}
	};

})();
