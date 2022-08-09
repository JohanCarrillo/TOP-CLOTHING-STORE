'use strict'

const async = require('async');

const Item = require('../models/item');
const ItemInstance = require('../models/itemInstance');
const Category = require('../models/category');
const Collection = require('../models/clothCollection');

module.exports = function indexController(req, res, next) {
	async.parallel({
		categoryCount(callback) {
			Category.countDocuments({}, callback);
		},
		collectionCount(callback) {
			Collection.countDocuments({}, callback);
		},
		itemCount(callback) {
			Item.countDocuments({}, callback);
		},
		itemInstanceInMainStoreCount(callback) {
			ItemInstance.countDocuments({ store: 'main store' }, callback);
		},
		itemInstanceNotInMainStoreCount(callback) {
			ItemInstance.countDocuments({ store: { $ne: 'main store' } }, callback);
		}
	}, (err, results) => {
		res.render('index', {
			title: 'Clothing Store Home',
			error: err,
			data: results
		});

	});
}