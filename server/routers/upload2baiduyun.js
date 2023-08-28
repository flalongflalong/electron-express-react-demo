const express = require('express');
const fs = require('fs');
const https = require('https');
const crypto = require('crypto');
const baiduRouter = new express.Router();
const axios = require('axios');
const sd = require('silly-datetime');
const dotenv = require('dotenv');
const appConfig = require('../../appConfig/index');
const pkg = require('../../package.json');

const appName = pkg.name || 'app';
const time = sd.format(new Date(), 'YYYYMMDDHHmm');
const fileName = `${appName}DEV-${time}.zip`; // 上传文件名称
const filePath = `./${fileName}`; // 本地文件路径
const urlPath = `/work/node-workspace/${fileName}`; // 网盘的上传地址

dotenv.config();
// 加载特定于环境变量的 .env.baidu 文件
dotenv.config({ path: '.env.baidu' });

console.log(`BAIDU_APP_KEY: ${process.env.BAIDU_APP_KEY}`)

/**
 * BAIDU_APP_KEY 百度应用的AppKey；
 * TOKENURL 浏览器直接输入该地址 可获取到临时 token
 * REDIRECT_URI  您应用的授权回调地址
 * PRECREATEURL 预上传url
 * UPLOADURL 上传url
 */
const REDIRECT_URI = 'oob';
const HOSTNAME = 'http://openapi.baidu.com';
const BAIDU_APP_KEY = process.env.BAIDU_APP_KEY;
const BAIDU_TOKEN = process.env.BAIDU_TOKEN;
const TOKENURL = `${HOSTNAME}/oauth/2.0/authorize?response_type=token&client_id=${BAIDU_APP_KEY}&REDIRECT_URI=oob&scope=basic,netdisk&display=page&state=xxx`;
const PRECREATEURL = `https://pan.baidu.com/rest/2.0/xpan/file?method=precreate&access_token=${BAIDU_TOKEN}`;
const UINFOURL = `https://pan.baidu.com/rest/2.0/xpan/nas?access_token=${BAIDU_TOKEN}&method=uinfo`;
const UPLOADURL = `https://pan.baidu.com/rest/2.0/xpan/file?method=create`;
const SIZE = 4 * 1024 * 1024; //文件切片大小

async function getFileSize() {
	return new Promise((res) => {
		fs.stat(filePath, {}, (err, stats) => {
			if (!err) {
				daxiao = stats.size;
				let fenpian = Math.ceil(stats.size / SIZE);
				res({
					size: daxiao,
					num: fenpian,
				});
			} else {
				console.error('文件路径错误或文件不存在');
			}
		});
	});
}

async function getfile({ url, i }) {
	return new Promise((res) => {
		let data = '';
		let start = i * SIZE;
		let end = (i + 1) * SIZE - 1;
		const stream = fs.createReadStream(url, {
			start,
			end,
		});
		stream.on('data', (chunk) => {
			// console.log(接收到 ${chunk.length} 个字节的数据);
			if (!data) {
				data = chunk;
			} else {
				data = Buffer.concat([data, chunk]);
			}
		});
		stream.on('end', () => {
			res(data);
		});
	});
}

async function getmd5list(url, info) {
	promistlist = [];
	// fs.createReadStream
	for (let i = 0; i < info.num; i++) {
		let data = await getfile({ url, i });
		const hash = crypto.createHash('md5'); // 创建一个md5加密的hash
		hash.update(data); // 更新内容
		const md5 = hash.digest('hex'); // 返回计算内容
		console.log(md5);
		promistlist.push(md5);
	}
	return promistlist;
}

async function precreate(info, url) {
	let block_list = await getmd5list(url, info);
	block_list = JSON.stringify(block_list);
	let data = {
		path: encodeURI(`${urlPath}`), //这是你的上传地址 需要进行url编码
		size: info.size, //上传大小
		isdir: 0, // 是不是文件夹 0 文件 1 文件夹
		autoinit: 1,
		block_list, // md5的list 注意按顺序
		rtype: 1,
	};
	let str = ''; // 这个需要拼接成formdata格式的，所以这面就手动拼接了
	for (let i in data) {
		str += `${i}=${data[i]}&`;
	}

	axios.post(PRECREATEURL, str).then((res) => {
		// 如果成功的话就是会返回 uploadid 和  block_list
		// uplpadid就是下面上传的id  block_list就是要上传的分片
		upload({
			url,
			info,
			uploadid: res.data.uploadid,
			pian: res.data.block_list,
		});
	});
}

async function upload({ url, info, uploadid, pian }) {
	console.log(`baidu upload file :${appName}DEV-${time}.zip`);

	for (let i of pian) {
		let data = await getfile({ url, i });
		await uploadfile(i, data, uploadid); // 循环上传需要上传的分片
	}

	// 下面的操作是上传完成合成文件
	let data = {
		path: encodeURI(urlPath), // 与上面那个一定要相同 而且还是需要url编码
		size: daxiao, // 这个就是上传的大小，而且是总大小，不是分片的大小
		isdir: 0,
		rtype: 1,
		uploadid, // 这个就是上面返回的uploadid
		block_list: JSON.stringify(promistlist), // 这个就是上传的MD5列表，还是全部的
	};
	let s = ''; // 需要formdata格式
	for (let i in data) {
		s += i + '=' + data[i] + '&';
	}
	console.log(s);
	axios
		.post(UPLOADURL, s, {
			params: {
				access_token: BAIDU_TOKEN,
			},
		})
		.then((res) => {
			console.log(res);
		})
		.catch((error) => {
			console.log(error);
		});
}

function uploadfile(i, data, uploadid) {
	return new Promise((r) => {
		console.log(data.length);
		let urls = '/rest/2.0/pcs/superfile2?'; // 请求地址
		let params = {
			access_token: BAIDU_TOKEN, // 你的token
			method: 'upload', // 默认
			type: 'tmpfile', // 默认
			path: encodeURI(filePath), //上传地址 与之前的相同
			uploadid, //还是返回的uploadid
			partseq: i, // 这个是分片的编号
		};
		for (let j in params) {
			urls += j + '=' + params[j] + '&';
		}
		// 下面由于我用axios上传失败了 改用httpsrequest
		const options = {
			hostname: 'd.pcs.baidu.com',
			port: 443,
			path: urls,
			method: 'PUT', // 这面官网说是post 但是我试了下必须put 不然一直错
			headers: {
				'content-type': 'multipart/form-data', //这是格式
				'Content-Length': data.length, // 这是主体长度
			},
		};

		const req = https.request(options, (res) => {
			console.log('状态码:', res.statusCode);
			console.log('请求头:', res.headers);

			res.on('data', (d) => {
				process.stdout.write(d);
			});
			r(1);
		});

		req.on('error', (e) => {
			console.error(e);
		});
		req.write(data); // 写入数据
		req.end(); //写入完成一定要执行end
	});
}

async function autoUpload() {
	console.log(`upload file: ${filePath} to ${urlPath}`);
	let fileInfo = await getFileSize();
	let fileList = await precreate(fileInfo, filePath);
	console.log(`upload file over: ${filePath} to ${urlPath}`);
}
autoUpload();

baiduRouter.get('/tooken', function (req, res) {
	axios
		.get(TOKENURL)
		.then((response) => {
			// console.log(response.data);
			res.send(response.data);
		})
		.catch((error) => {
			// console.log(error);
			res.send({
				keyCode: '96',
				msg: error,
			});
		});
});

baiduRouter.get('/uinfo', function (req, res) {
	axios
		.get(UINFOURL)
		.then((response) => {
			// console.log(response.data);
			res.send(response.data);
		})
		.catch((error) => {
			// console.log(error);
			res.send({
				keyCode: '96',
				msg: error,
			});
		});
});
baiduRouter.get('/upload', async function (req, res) {
	let fileInfo = await getFileSize();

	let fileList = await precreate(fileInfo, filePath);

	debugger;
	res.send({
		keyCode: '00',
	});
});

module.exports = baiduRouter;
