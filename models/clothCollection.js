'use strict'

const { model, Schema } = require('mongoose');

const ClothCollectionSchema = new Schema({
	name: {type: String, required: true},
	description: {type: String, required: true, maxLength: 100, minLength: 5},
});

ClothCollectionSchema.virtual('url').get(() => {
	return '/catalog/collection/' + this._id;
});

module.exports = model('ClothCollection', ClothCollectionSchema);