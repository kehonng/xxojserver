const http = require('http');
const open = require('./utils/open');

const defaultConfig = require('./config');
const middleware = require('./middleware');
//引入命令配置
const argv = require('./cli');
//合并配置
const config = Object.assign({}, defaultConfig, argv);
const {
	port,
	host,
	root
} = config;
//创建服务
const server = http.createServer(middleware(root));
//启动服务器
server.listen(port, host, (err) => {
	if (err) {
		console.log("服务器地址找不到:", err);
		return;
	}
	const address = `http://${host}:${port}`;
	console.log("服务器地址启动成功,地址:", address);
	//服务器启动成功了再执行自动打开命令
	open(address);
});
