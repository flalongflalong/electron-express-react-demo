/**
 * Created by pc on 2018/4/4.
 */
var express = require('express');
var router = express.Router();

// 重启机器
function SyncReboot(req) {
	var execSync = require('child_process').execSync;
	execSync('shutdown /r /t 0');
}

/**
 *  关机api
 */
proRouter.post('/shutdownComputer', function (req, res) {
	let ajaxRet;
	try {
		SyncReboot(req);

		ajaxRet = {
			msg: 'shutdownComputer success',
		};
	} catch (error) {
		ajaxRet = {
			msg: 'shutdownComputer error：' + error,
		};
	}

	res.send(ajaxRet);
});

module.exports = router;
