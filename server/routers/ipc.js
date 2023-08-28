var express = require('express');
const {ipcRenderer} = require("electron");
const ipcRouter = new express.Router();

let _ipc = {
  on:function (eventName, cb) {
    console.log('on :' + eventName);

  }
}

ipcRouter.post('/ipcOnMsg', function (req, res) {

  ipcRenderer.sendSync("send-message-to-main","这是来自渲染进程的数据：公众号：霸道的程序猿");

  res.send({
    retcode:'ipcOnMsg: 00',
  });

});

module.exports = ipcRouter;