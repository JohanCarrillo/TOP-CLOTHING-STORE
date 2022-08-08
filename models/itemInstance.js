'use strict'

const { model, Schema } = require('mongoose');

const ItemInstanceSchema = new Schema({
	item: {type: Schema.Types.ObjectId, ref: 'Item'},
	number_in_stock: {type: Number, default: 0}
});

ItemInstanceSchema.virtual('url').get(() => {
	return '/catalog/itemInstance/' + this._id;
});

module.exports = model('ItemInstance', ItemInstanceSchema);