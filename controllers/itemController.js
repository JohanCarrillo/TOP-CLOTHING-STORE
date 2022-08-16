"use strict";

const async = require("async");
const { body, validationResult } = require("express-validator");

const Item = require("../models/item");
const ItemInstance = require("../models/itemInstance");
const ClothCollection = require("../models/clothCollection");
const Category = require("../models/category");

function itemCreateGet(req, res, next) {
	async.parallel(
		{
			categories(callback) {
				Category.find().exec(callback);
			},
			collections(callback) {
				ClothCollection.find().exec(callback);
			},
		},
		(err, results) => {
			if (err) return next(err);
			res.render("item_form", {
				title: "Add New Item",
				collection_list: results.collections,
				category_list: results.categories,
			});
		}
	);
}

const itemCreatePost = [
	body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
	body("description", "Description must not be empty.")
		.trim()
		.isLength({ min: 1 })
		.escape(),
	body("price", "Invalid price")
		.trim()
		.isLength({ min: 1 })
		.isFloat({ min: 0 })
		.toFloat(),

	(req, res, next) => {
		const errors = validationResult(req);

		var item = new Item({
			name: req.body.name,
			description: req.body.description,
			price: req.body.price,
			cloth_collection: req.body.collection,
			category: req.body.category,
			sizes: req.body.size,
		});

		if (!errors.isEmpty()) {
			async.parallel(
				{
					collections(callback) {
						ClothCollection.find().exec(callback);
					},
					categories(callback) {
						Category.find().exec(callback);
					},
				},
				(err, results) => {
					if (err) return next(err);
					res.render("item_form", {
						title: "Add New Item",
						collection_list: results.collections,
						category_list: results.categories,
						item: item,
						errors: errors.array(),
					});
				}
			);
			return;
		} else {
			item.save(err => {
				if (err) return next(err);
				res.redirect(item.url);
			});
		}
	},
];

function itemDeleteGet(req, res, next) {
	async.parallel(
		{
			foundItem(callback) {
				Item.findById(req.params.id)
					.populate("category")
					.populate("cloth_collection")
					.exec(callback);
			},
			itemInstances(callback) {
				ItemInstance.find({ item: req.params.id }).exec(callback);
			},
		},
		(err, results) => {
			if (err) return next(err);
			if (results.foundItem == null) res.redirect("/item");
			res.render("item_delete", {
				title: "Delete Item",
				item: results.foundItem,
				itemInstance_list: results.itemInstances,
			});
		}
	);
}

function itemDeletePost(req, res, next) {
	res.send("NOT IMPLEMENTED: item delete delete");
}

function itemUpdateGet(req, res, next) {
	res.send("NOT IMPLEMENTED: item update get");
}

function itemUpdatePost(req, res, next) {
	res.send("NOT IMPLEMENTED: item update put");
}

function itemDetail(req, res, next) {
	async.parallel(
		{
			item(callback) {
				Item.findById(req.params.id)
					.populate("cloth_collection")
					.populate("category")
					.exec(callback);
			},
			instances(callback) {
				ItemInstance.find({ item: req.params.id }).exec(callback);
			},
		},
		(err, results) => {
			if (err) return next(err);
			if (results.item == null) {
				const err = new Error("Item not Found");
				err.status = 404;
				return next(err);
			}
			res.render("item_detail", {
				title: "Item Detail",
				item: results.item,
				instance_list: results.instances,
			});
		}
	);
}

function itemList(req, res, next) {
	Item.find()
		.select({ name: 1 })
		.exec((err, items) => {
			if (err) return next(err);
			res.render("item_list", {
				title: "List of Items",
				item_list: items,
			});
		});
}

module.exports = {
	itemCreateGet,
	itemCreatePost,
	itemDeleteGet,
	itemDeletePost,
	itemUpdateGet,
	itemUpdatePost,
	itemDetail,
	itemList,
};
