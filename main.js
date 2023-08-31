// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, Tray } = require('electron');
const path = require('path');
const { execFile } = require('child_process');
const dotenv = require('dotenv');
const { delay } = require('lodash');
const { serverInit } = require('./server/index');
const { appDebugger, httpPort } = require('./appConfig/index');
const pkg = require('./package.json');

dotenv.config();

const isDev = process.env.NODE_ENV === 'development';

let mainWindow = null; //主窗口
let appTray = null; //系统托盘

function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		},
	});

	// and load the index.html of the app.
	// mainWindow.loadFile('index.html')
	mainWindow.loadURL(`http://127.0.0.1:${httpPort}`);

	// Open the DevTools.
	appDebugger && mainWindow.webContents.openDevTools();

	//menu shortKey
	const menuTemplate = [
		{
			label: 'View',
			submenu: [
				{
					label: 'Reload',
					accelerator: 'CmdOrCtrl+R',
					click: function (item, focusedWindow) {
						if (focusedWindow) {
							focusedWindow.reload();
						}
					},
				},
				{
					label: 'Toggle Full Screen',
					accelerator: (function () {
						if (process.platform === 'darwin') {
							return 'Ctrl+Command+F';
						} else {
							return 'F11';
						}
					})(),
					click: function (item, focusedWindow) {
						if (focusedWindow) {
							focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
						}
					},
				},
				{
					label: 'Hide Screen',
					accelerator: 'CmdOrCtrl+H',
					click: function (item, focusedWindow) {
						if (focusedWindow) {
							focusedWindow.minimize();
						}
					},
				},
				{
					label: 'Toggle Developer Tools',
					accelerator: (function () {
						if (process.platform === 'darwin') {
							return 'Alt+Command+I';
						} else {
							return 'F12';
						}
					})(),
					click: function (item, focusedWindow) {
						if (focusedWindow) {
							focusedWindow.toggleDevTools();
						}
					},
				},
			],
		},
	];
	const menu = Menu.buildFromTemplate(menuTemplate);
	Menu.setApplicationMenu(menu);
}

function createTray() {
	// 创建系统托盘
	if (appTray == null) {
		appTray = new Tray(path.join(__dirname, 'assets/app-icon/win/app.ico'));
		appTray.setToolTip(`${pkg.name}`);
		appTray.on('double-click', function () {
			if (mainWindow != null) mainWindow.show();
		});
		let trayMenu = Menu.buildFromTemplate([
			{
				label: '退出',
				click: function () {
					app.quit();
				},
			},
		]);
		appTray.setContextMenu(trayMenu); // 右键菜单
	}
}

// 设置单例锁
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
	//win 杀掉错误的进程
	const precssName = isDev ? 'Electron' : pkg.name;

	app.quit();
	execFile('killProcess.bat', [precssName], { cwd: process.cwd() }, function (error, stdout, stderr) {
		if (error !== null) {
			console.log('exec error' + error);
		} else {
			console.log('成功');
		}
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
	});
} else {
	// start backend server
	serverInit();

	// This method will be called when Electron has finished
	// initialization and is ready to create browser windows.
	// Some APIs can only be used after this event occurs.
	app.whenReady().then(() => {
		createWindow();
		createTray();

		app.on('activate', function () {
			// On macOS it's common to re-create a window in the app when the
			// dock icon is clicked and there are no other windows open.
			if (BrowserWindow.getAllWindows().length === 0) createWindow();
		});
	});

	app.on('second-instance', (event, commandLine, workingDirectory) => {
		// 当运行第二个实例时,将会聚焦到mainWindow这个窗口
		if (mainWindow) {
			if (mainWindow.isMinimized()) mainWindow.restore();
			mainWindow.focus();
		}
	});

	// Quit when all windows are closed.
	app.on('window-all-closed', function () {
		// On OS X it is common for applications and their menu bar
		// to stay active until the user quits explicitly with Cmd + Q
		if (process.platform !== 'darwin') {
			app.quit();
		}
	});
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
