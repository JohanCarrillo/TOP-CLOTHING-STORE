'use strict'

const { model, Schema } = require('mongoose');

const CategorySchema = new Schema({
	name: {type: String, required: true, minLength: 5}
});

CategorySchema.virtual('url').get(function() {
	return '/category/' + this.id;
});

module.exports = model('Category', CategorySchema);