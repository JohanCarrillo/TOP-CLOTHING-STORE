'use strict'

const { model, Schema } = require('mongoose');

const ItemInstanceSchema = new Schema({
	item: {type: Schema.Types.ObjectId, ref: 'Item'},
	number_in_stock: {type: Number, default: 0},
	store: {type: String, default: 'main store'}
});

ItemInstanceSchema.virtual('url').get(function() {
	return '/itemInstance/' + this._id;
});

module.exports = model('ItemInstance', ItemInstanceSchema);