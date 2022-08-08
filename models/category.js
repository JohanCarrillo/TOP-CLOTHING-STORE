'use strict'

const { model, Schema } = require('mongoose');

const CategorySchema = new Schema({
	body_part: {type: String, required: true}
});

CategorySchema.virtual('url').get(() => {
	return '/catalog/category/' + this._id;
});