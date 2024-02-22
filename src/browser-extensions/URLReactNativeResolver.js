
function URLReactNativeResolver(fs) {
	this.fs = fs;
	this.resolving = {};
	this.rnfs = null;
	try {
		this.rnfs = require("rnfs");
	} catch (error) {
		console.log("failed to resolve rnfs");
	}
}

function fetchUrl(url, headers) {
	return new Promise(function (resolve, reject) {
		const xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		for (const headerName in headers) {
			xhr.setRequestHeader(headerName, headers[headerName]);
		}
		xhr.responseType = "arraybuffer";

		xhr.onreadystatechange = function () {
			if (xhr.readyState !== 4) {
				return;
			}

			const ok = xhr.status >= 200 && xhr.status < 300;
			if (!ok) {
				setTimeout(function () {
					reject(new TypeError('Failed to fetch (url: "' + url + '")'));
				}, 0);
			}
		};

		xhr.onload = function () {
			const ok = xhr.status >= 200 && xhr.status < 300;
			if (ok) {
				resolve(xhr.response);
			}
		};

		xhr.onerror = function () {
			setTimeout(function () {
				reject(new TypeError('Network request failed (url: "' + url + '")'));
			}, 0);
		};

		xhr.ontimeout = function () {
			setTimeout(function () {
				reject(new TypeError('Network request failed (url: "' + url + '")'));
			}, 0);
		};

		xhr.send();
	});
}

URLReactNativeResolver.prototype.resolve = function (url, headers) {
	const scheme = url.substring(0, 6).toLowerCase();
	const isHttp = scheme.indexOf("https:") === 0 || scheme.indexOf("http:") === 0;
	const isBase64 = scheme.indexOf("data:") === 0;
	if (!this.resolving[url]) {
		const _this = this;
		this.resolving[url] = new Promise(function (resolve, reject) {
			if (isBase64) {
				resolve();
			} else if (isHttp) {
				if (_this.fs.existsSync(url)) {
					// url was downloaded earlier
					resolve();
				} else {
					fetchUrl(url, headers).then(
						function (buffer) {
							_this.fs.writeFileSync(url, buffer);
							resolve();
						},
						function (result) {
							reject(result);
						}
					);
				}
			} else if (_this.rnfs) {
				if (_this.fs.existsSync(url)) {
					resolve();
				} else {
					_this.rnfs
						.readFile(url, "base64")
						.then((base64Str) => {
							_this.fs.writeFileSync(url, Buffer.from(base64Str, "base64"));
							resolve();
						})
						.catch(reject);
				}
			} else {
				// cannot be resolved
				resolve();
			}
		});
	}

	return this.resolving[url];
};

URLReactNativeResolver.prototype.resolved = function () {
	const _this = this;
	return new Promise(function (resolve, reject) {
		Promise.all(Object.values(_this.resolving)).then(function () {
			resolve();
		}, function (result) {
			reject(result);
		});
	});
};

module.exports = URLReactNativeResolver;
