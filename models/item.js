'use strict'

const { model, Schema } = require('mongoose');

const ItemSchema = new Schema({
	name: {type: String, required: true},
	desccription: {type: String, required: true, maxLength: 100, minLength: 5},
	price: {type: Number, required: true},
	collection: {type: Schema.Types.ObjectId, ref: 'Collection'},
	category: {type: Schema.Types.ObjectID, ref: 'Category'},
	sizes: {type: [String], required: true}
});

ItemSchema.virtual('url').get(() => {
	return '/catalog/item/' + this._id;
});

module.exports = model('Item', ItemSchema);