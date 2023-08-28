const fs = require('fs');
const path = require('path');
const { src, dest, series, parallel } = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const less = require('gulp-less');
const cleanCSS = require('gulp-clean-css');
const gulpif = require('gulp-if');
const rename = require('gulp-rename');
const zip = require('gulp-zip');
const clean = require('gulp-clean');
const util = require('gulp-util');
const replace = require('gulp-replace');
const sd = require('silly-datetime');
const dotenv = require('dotenv');

dotenv.config();
const isDev = process.env.NODE_ENV === 'development';

const pkg = require('../package.json');
const appConfig = require('../appConfig/index');

const APPOUTDIRPARENT = `../out`,
	ENVPATH = path.join(__dirname, `../out/${pkg.name}-win32-x64/resources/app/.env`),
	APPOUTDIR = `${APPOUTDIRPARENT}/${pkg.name}-win32-x64/resources/app`, //构建的目标目录
	ROUTEPATH = `${APPOUTDIR}/server/routers`;

let clearForceAppOut = function () {
	return src([`${APPOUTDIRPARENT}`], {
		read: false,
		allowEmpty: true,
	}).pipe(clean({ force: true })); // this is force option
};

let setEnvProduction = async function () {
    try {
        // 1. 读取.env文件的内容
        const data = await fs.promises.readFile(ENVPATH, 'utf8');

        // 2. 使用正则表达式替换NODE_ENV的值
        const updatedData = data.replace(/^NODE_ENV=.*$/m, "NODE_ENV='production'");

        // 3. 将修改后的内容写回.env文件
        await fs.promises.writeFile(ENVPATH, updatedData, 'utf8');
    } catch (err) {
        console.error(err);
    }
};

exports.clearOut = series(clearForceAppOut);
exports.setEnvProduction = series(setEnvProduction);
