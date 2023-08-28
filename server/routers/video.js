const express = require('express');
const fs = require('fs');
const { get } = require('lodash');
const { ipcRenderer } = require('electron');
const videoRouter = new express.Router();

videoRouter.get('/', function (req, res) {
	// const path = `src/HYPE/${get(req, "query.name") || "testmovie"}.mp4`;
	const path = `${get(req, 'query.path')}`;
	const stat = fs.statSync(path);
	const fileSize = stat.size;
	const range = req.headers.range;
	const SPLITBYTE = 10 * 1024 * 1024; //分割视频文件

	if (range) {
		const parts = range.replace(/bytes=/, '').split('-');
		const start = parseInt(parts[0], 10);
		let end = parts[1] ? parseInt(parts[1], 10) : start + SPLITBYTE;
		end = end > fileSize - 1 ? fileSize - 1 : end;

		/* 不分割文件 */
		// const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

		if (start >= fileSize) {
			res.status(416).send('Requested range not satisfiable\n' + start + ' >= ' + fileSize);
			return;
		}
		const chunksize = end - start + 1;
		const file = fs.createReadStream(path, { start, end });
		const head = {
			'Content-Range': `bytes ${start}-${end}/${fileSize}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': chunksize,
			'Content-Type': 'video/mp4',
		};

		res.writeHead(206, head);
		file.pipe(res);
	} else {
		const head = {
			'Content-Length': fileSize,
			'Content-Type': 'video/mp4',
		};
		res.writeHead(200, head);
		fs.createReadStream(path).pipe(res);
	}
});

module.exports = videoRouter;
