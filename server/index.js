const express = require('express');
const logger = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const { httpPort } = require('../appConfig/index');

const b = require('./routers/upload2baiduyun')

dotenv.config()

const isDev = process.env.NODE_ENV === 'development';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(process.cwd(), isDev ? 'src' : 'resources/app/dist')));

// routes
app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, '/index.html'));
});
app.get('/test', (req, res) => {
	res.send('Welcome to your express API');
});

//port
app.listen(httpPort, () => console.log(`App running on port ${httpPort} 🔥`));
