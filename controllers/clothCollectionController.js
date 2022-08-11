'use strict'

const async = require('async');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

const ClothCollection = require('../models/clothCollection');
const Item = require('../models/item');


function clothCollectionCreateGet (req, res, next) {
	res.render('clothCollection_form', {title: 'Add a new Collection'});
}

const clothCollectionCreatePost = [

	body('name', 'Collection\'s name must not be empty').trim().isLength({ min: 1 }),
	body('description', 'Collection\'s description must not be empty').trim().isLength({ min: 1 }),

	function(req, res, next) {

		const errors = validationResult(req);

		const collection = new ClothCollection({
			name: req.body.name,
			description: req.body.description
		});

		if (!errors.isEmpty()) {
			res.render('clothCollection_form', 
				{
					title: 'Add a new Collection',
					collection: collection,
					errors: errors.array()
				}
			);
			return;
		} else {
			ClothCollection.findOne({ "name": { $regex : new RegExp(req.body.name, "i") } })
				.exec((err, foundCollection) => {
					if (err) return next(err);
					if (foundCollection) {
						console.log(foundCollection)
						res.redirect(foundCollection.url);
					} else {
						collection.save(err => {
							console.log(collection)
							if (err) return next(err);
							res.redirect(collection.url);
						});
					}
				});
			}
	}
];

function clothCollectionDeleteGet(req, res, next) {
	async.parallel({
		collection(callback) {
			ClothCollection.findById(req.params.id).exec(callback);
		},
		items(callback) {
			Item.find({ 'cloth_collection': req.params.id }).exec(callback);
		}
	}, (err, results) => {
		if (err) return next(err);
		if (results.collection == null) {
			res.redirect('/collection');
		}
		res.render('clothCollection_delete', {
			title: 'Delete Collection',
			collection: results.collection,
			items: results.items
		});
	});
}

function clothCollectionDeletePost(req, res, next) {
	async.parallel({
		collection(callback) {
			ClothCollection.findById(req.body.collectionId).exec(callback);
		},
		items(callback) {
			Item.find({ 'cloth_collection': req.body.collectionId }).exec(callback);
		}
	}, (err, results) => {
		if (err) return next(err);
		if (results.items.length > 0) {
      res.render('collection_delete', {
        title: 'Delete Collection',
        collection: results.collection,
        items: results.items
      });
      return;
    } else {
			ClothCollection.findByIdAndRemove(req.body.collectionId, (err) => {
				if (err) return next(err);
				res.redirect('/collection');
			})
		}
	});
}

function clothCollectionUpdateGet(req, res, next) {
	ClothCollection.findById(req.params.id).exec((err, collection) => {
		if (err) return next(err);
		if (collection == null) {
			const err = new Error('Collection not Found');
			err.status = 404;
			return next(err);
		}
		res.render('clothCollection_form', {
			title: 'Delete Collection',
			collection: collection
		});
	});
}

const clothCollectionUpdatePost = [

	body('name', 'Collection\'s name must not be empty').trim().isLength({min: 1}).escape(),
	body('description', 'Collection\'s description must not be empty').trim().isLength({min: 1}).escape(),

	(req, res, next) => {
		const errors = validationResult(req);
		const collection = new ClothCollection({
			name: req.body.name,
			description: req.body.description,
			_id: req.params.id
		});

		if (!errors.isEmpty()) {
			res.render('clothCollection_form', {
				title: 'Collection Update',
				collection: collection,
				errors: errors.array()
			});
		} else {
			ClothCollection.findByIdAndUpdate(req.params.id, collection, {}, (err, updatedCollection) => {
				if (err) return next(err);
				res.redirect(updatedCollection.url);
			});
		}
	}
];

function clothCollectionDetail(req, res, next) {
	const id = mongoose.Types.ObjectId(req.params.id);
	console.log(req.params.id)
	async.parallel({
		clothCollection(callback) {
			ClothCollection.findById(id)
				.exec(callback);
		},
		items(callback) {
			Item.find({ 'cloth_collection': id })
				.exec(callback);
		}
	}, (err, results) => {
			if (err) return next(err);
			if(results.clothCollection == null) {
				const err = new Error('Collection not Found');
				return next(err);
			}
			res.render('clothCollection_detail', {
				title: 'Collection Details',
				collection: results.clothCollection,
				item_list: results.items
			})
		}
	);
}

function clothCollectionList(req, res, next) {
	ClothCollection.find()
		.sort({ name: 1 })
		.exec((err, collections) => {
			if (err) return next(err);
			res.render('clothCollection_list', {
				title: 'List of Collections',
				collection_list: collections
			});
		});
}


module.exports = {
	clothCollectionCreateGet,
	clothCollectionCreatePost,
	clothCollectionDeleteGet,
	clothCollectionDeletePost,
	clothCollectionUpdateGet,
	clothCollectionUpdatePost,
	clothCollectionDetail,
	clothCollectionList
}