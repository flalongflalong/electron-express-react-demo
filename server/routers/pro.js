const express = require('express');
let path = require('path');
let proRouter = new express.Router();

/**
 *  测试交易
 */
proRouter.post('/test', function (req, res) {
	let ajaxRet = {
		msg: 'test',
	};

	res.send(ajaxRet);
});

module.exports = proRouter;
