require('dotenv').config();
const validUrl = require('valid-url')
const urlExist = require('url-exist')
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)
const Url  = require('./models/Url.js')
const URL = require('url').URL
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
}).then(() => {console.log("Connect successfull")})

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', async (req, res) => {

	if (!validUrl.isUri(req.body.url) && !await urlExist(req.body.url)) {
		return res.status(500).json({error: 'invalid url'})
	} 

	try {
		const urlFound = await Url.findOne({original_url: req.body.url})

		if (!urlFound) {
			const url = await Url.create({original_url: req.body.url})

			return res.status(201).json({
				original_url: url.original_url,
				short_url: url.short_url
			})
		}

		res.status(200).json({
			original_url: urlFound.original_url,
			short_url: urlFound.short_url
		})
	} catch (error) {
		res.status(500).json({error})
	}
})

app.get('/api/shorturl/:id', async (req, res) => {
	try {
		const url = await Url.findOne({short_url: req.params.id})
		res.redirect(url.original_url)
	} catch(error) {
		res.json({error: 'not found'})
	}
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
