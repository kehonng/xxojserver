/*
  定义缓存
*/
const etag = require('etag');

//判断是否有命中缓存
/**
 *
 * @param {*} req 请求对象
 * @param {*} stats 文件内容，通过fs.stat生成
 */
function checkCache(req, stats) {
	//先获取客户端发送的If-None-Match If-Modified-Since
	const ifNoneMatch = req.headers["if-none-match"]; // 属性名都是小写~
	const ifModifiedSince = req.headers["if-modified-since"]; // 属性名都是小写~

	//判断ifNoneMatch和服务器中的Etag是否一致
	const eTag = etag(stats);
	if (ifNoneMatch && ifNoneMatch === eTag) {
		return true;
	}
	//判断ifNoneMatch和服务器中的Etag是否一致
	//获取文件上一次修改时间 - 转换成GMT格式
	const lastModified = new Date(stats.mtime).toGMTString();
	if (ifModifiedSince && ifModifiedSince === lastModified) {
		return true;
	}

	//都不相等，就返回false
	return false;
}

function setCache(res, stats) {
	//设置强制缓存
	res.setHeader('Cache-Control', 'max-age=3600,public');
	res.setHeader('expires', new Date(Date.now() + 3600).toGMTString());
	//设置协商缓存
	res.setHeader('Etag', etag(stats));
	res.setHeader('Last-MOdified', new Date(Date.now() + 3600).toGMTString());
}

/**
 *
 * @param {*} res 响应对象
 */
function cache(res, stats, req) {
	//判断浏览器是否命中缓存
	//只需要判断协商缓存，强制缓存不会发送请求，协商缓存命中就会发送请求
	const isCache = checkCache(req, stats);

	//如果命中缓存
	if (isCache) {
		//修改状态码
		res.statusCode = 304;
		res.end();
		return true;
	}
	//没有命中
	//缓存过期，或者第一次访问,需要重新设置新缓存
	setCache(res, stats);
	return false;
}

module.exports = cache;
