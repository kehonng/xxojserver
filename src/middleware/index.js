/*
  中间件
  用来处理响应返回
*/
const util = require("util");

const fs = require('fs');
/* const {
  root
} = require('../config') */
const path = require('path');
const pug = require('pug');
const getMimeType = require("../utils/mime");
const compress = require('../utils/compress');
const cache = require('../utils/cache');


const stat = util.promisify(fs.stat);
const readdir = util.promisify(fs.readdir);
//const readFile = util.promisify(fs.readFile);

module.exports = (root) => {
	async (req, res) => {
		//请求对象req  req响应对象

		//获取请求路径
		const url = req.url;
		//合成绝对路径
		const filePath = path.resolve(root, `.${url}`);

		//防止错误
		try {
			//分析文件路径
			const stats = await stat(filePath);

			//判断是否是文件夹
			if (stats.isDirectory()) {
				const files = await readdir(filePath);

				// 渲染pug成html
				const pugFilePath = path.resolve(__dirname, "../views/index.pug");
				const html = pug.renderFile(pugFilePath, {
					files,
					url
				});
				//返回响应
				//修改状态码
				res.statusCode = 200;
				res.setHeader("Content-Type", "text/html;charset=utf8");
				res.end(html);
				return;
			}
			//判断是否是文件
			if (stats.isFile()) {
				//const data = await readFile(filePath)
				let rs = fs.createReadStream(filePath);

				//缓存控制
				const isCache = cache(res, stats, req);
				// 如果命中缓存，在函数中已经设置 statusCode 和 end，就不需要接着执行了
				if (isCache) true;

				const mimeType = getMimeType(filePath);
				//压缩文件,html|javaScript|css|json
				if (mimeType.match(/html|javaScript|css|json/)) {
					rs = compress(rs, req, res);
				}

				//返回响应
				//修改状态码
				res.statusCode = 200;
				res.setHeader("Content-Type", `${mimeType};charset=utf8`);
				//res.end(data)
				rs.pipe(res);
				return;
			}
		} catch (error) {
			console.log(error);
			//响应错误代码
			res.statusCode = 404;
			res.setHeader("Content-Type", "text/plain;charset=utf8");
			res.end(`.${url}不是一个文件或者文件夹`);
		}
	};
};
