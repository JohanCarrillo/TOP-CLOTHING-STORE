'use strict'

const { model, Schema } = require('mongoose');

const CollectionSchema = new Schema({
	name: {type: String, required: true},
	desccription: {type: String, required: true, maxLength: 100, minLength: 5},
});

CollectionSchema.virtual('url').get(() => {
	return '/catalog/collection/' + this._id;
});

module.exports = model('Collection', CollectionSchema);