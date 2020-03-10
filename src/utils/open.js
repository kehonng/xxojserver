/*
  自动打开浏览器
*/
const {
	exec
} = require("child_process");

module.exports = function (url) {
	//判断操作系统是哪一种
	let cmd = "";
	switch (process.platform) {
		case "darwin": //mac
			cmd = "open";
			break;
		case "win32": //windows
			cmd = "start";
			break;
		case "linux": // linux
			cmd = "xdg-open";
			break;
	}
	//在终端中执行打开命令
	exec(`${cmd} ${url}`);
};
