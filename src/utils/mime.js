/*
  处理文件的Content-Type
*/
const path = require("path");

const mimeTypes = {
	js: "application/javascript",
	css: "text/css",
	html: "text/html",
	txt: "text/plain",
	gif: "image/gif",
	jpg: "image/jpeg",
	jpeg: "image/jpeg",
	png: "image/png",
	icon: "image/x-icon",
	svg: "image/svg+xml",
	json: "application/json",
	mp3: "audio/mp3",
	mp4: "video/mp4"
};

//获取mimeType的消息
/**
 *
 * @param {string} files 绝对路径
 */
function getMimeType(filePath) {
	// 获取文件的扩展名
	const extname = path.extname(filePath).slice(1);
	return mimeTypes[extname];
}
module.exports = getMimeType;
