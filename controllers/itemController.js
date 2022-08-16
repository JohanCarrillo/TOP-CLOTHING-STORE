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

function itemCreatePost(req, res, next) {
	res.send(req.body);
}

function itemDeleteGet(req, res, next) {
	res.send("NOT IMPLEMENTED: item delete get");
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
