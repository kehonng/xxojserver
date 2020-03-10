/*
  压缩文件
*/

const {
	createGzip,
	createDeflate
} = require('zlib');

/**
 *
 * @param {*} rs 可读流
 * @param {*} req 请求对象
 */
function compress(rs, req, res) {
	//是否可以压缩
	const acceptEncoding = req.headers['accept-encoding'];
	if (acceptEncoding) {
		//用什么方式进行压缩
		const acceptEncodingArr = acceptEncoding.split(', ');
		//gzip,
		if (acceptEncodingArr.indexOf('gzip') !== -1) {
			//设置响应头,告诉浏览器我们压缩了
			res.setHeader("Content-Encoding", 'gzip');
			rs = rs.pipe(createGzip());
			return rs;
		}
		//deflate
		if (acceptEncodingArr.indexOf('deflate') !== -1) {
			//设置响应头,告诉浏览器我们压缩了
			res.setHeader("Content-Encoding", 'deflate');
			rs = rs.pipe(createDeflate());
			return rs;
		}
	}

	//返回一个可读流
	return rs;
}

module.exports = compress;
