const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: {
		app: './src/index.js',
	},
    resolve: {
        alias: {
          '@assets': path.resolve(__dirname, 'src/assets/')
        }
      },
	output: {
		filename: 'app.bundle.js',
		path: path.resolve(__dirname, './dist'),
		publicPath: './',
		assetModuleFilename: 'assets/[hash][ext][query]', // 替代 file-loader
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: 'babel-loader',
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader', 'postcss-loader'],
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset/resource/', // 替代 file-loader
				generator: {
					filename: 'assets/[hash][ext][query]', // 输出到 assets 文件夹
				},
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.ejs',
		}),
		new CopyWebpackPlugin({
			patterns: [{ from: './src/favicon.ico' }, { from: './src/assets', to: 'assets' }],
		}),
	],
	devtool: 'eval',
};
