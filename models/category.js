'use strict'

const { model, Schema } = require('mongoose');

const CategorySchema = new Schema({
	name: {type: String, required: true}
});

CategorySchema.virtual('url').get(() => {
	return '/catalog/category/' + this._id;
});

module.exports = model('Category', CategorySchema);