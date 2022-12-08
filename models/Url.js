const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const Schema = mongoose.Schema

const urlSchema = new Schema({
	original_url: String,
	short_url: Number
})

urlSchema.plugin(AutoIncrement, {inc_field: 'short_url'})

module.exports = mongoose.model('Url', urlSchema)
