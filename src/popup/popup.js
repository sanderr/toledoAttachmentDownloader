window.onload = () => {
	const zip = new JSZip();

	const getPdf = (url, callback) => {
		const xhr = new XMLHttpRequest();
		xhr.responseType = "arraybuffer";
		xhr.onreadystatechange = function() { 
		if (xhr.readyState === 4 && xhr.status === 200)
			callback(xhr.response);
		}
		xhr.open("GET", url, true);
		xhr.send(null);
	};

	getPdf("https://p.cygnus.cc.kuleuven.be/bbcswebdav/pid-21684732-dt-content-rid-120613012_2/xid-120613012_2", (response) => {
		zip.file("somepdf.pdf", response, { binary: true });
		zip.generateAsync({type:"blob"})
		.then(function(content) {
			/*
			const url = URL.createObjectURL(content);
			window.open(url);
			*/
			saveAs(content, "example.zip");
		});
	});
}
