"use strict";

const async = require("async");
const { body, validationResult } = require("express-validator");

const Item = require("../models/item");
const ItemInstance = require("../models/itemInstance");

function itemInstanceCreateGet(req, res, next) {
	Item.find().exec((err, items) => {
		if (err) return next(err);
		res.render("itemInstance_form", {
			title: "Add new Item Instance",
			item_list: items,
		});
	});
}

const itemInstanceCreatePost = [
	body("number_in_stock").trim().escape(),
	body("store").trim().escape(),

	(req, res, next) => {
		const errors = validationResult(req);

		const instance = new ItemInstance({
			item: req.body.item,
			number_in_stock:
				req.body.number_in_stock == "" ? undefined : req.body.number_in_stock,
			store: req.body.store,
		});

		if (!errors.isEmpty()) {
			Item.find().exec((err, items) => {
				if (err) return next(err);

				res.render("itemInstance_form", {
					title: "Add new Instance",
					item_list: items,
					instance: instance,
					errors: errors.array(),
				});
			});
			return;
		} else {
			// check if itemInstance exists
			ItemInstance.findOne({
				$and: [{ store: instance.store }, { item: instance.item }],
			}).exec((err, foundItemInstance) => {
				if (err) return next(err);
				// if it doesn't exist save it
				if (foundItemInstance == null) {
					instance.save(err => {
						if (err) return next(err);
						res.redirect(instance.url);
					});
				} else {
					// if it does exist redirect
					res.redirect(foundItemInstance.url);
				}
			});
		}
	},
];

function itemInstanceDeleteGet(req, res, next) {
	res.send("NOT IMPLEMENTED: itemInstance delete get");
}

function itemInstanceDeletePost(req, res, next) {
	res.send("NOT IMPLEMENTED: itemInstance delete delete");
}

function itemInstanceUpdateGet(req, res, next) {
	res.send("NOT IMPLEMENTED: itemInstance update get");
}

function itemInstanceUpdatePost(req, res, next) {
	res.send("NOT IMPLEMENTED: itemInstance update put");
}

function itemInstanceDetail(req, res, next) {
	ItemInstance.findById(req.params.id)
		.populate("item")
		.exec((err, itemInstanceFound) => {
			if (err) return next(err);
			if (itemInstanceFound == null) {
				const error = new Error("Instance not Found");
				error.status = 404;
				return next(err);
			}
			res.render("itemInstance_detail", {
				title: "Item Isntance Details",
				itemInstance: itemInstanceFound,
			});
		});
}

function itemInstanceList(req, res, next) {
	ItemInstance.find()
		.populate("item")
		.exec((err, itemInstanceList) => {
			if (err) return next(err);
			res.render("itemInstance_list", {
				title: "List of Item Instances",
				itemInstance_list: itemInstanceList,
			});
		});
}

module.exports = {
	itemInstanceCreateGet,
	itemInstanceCreatePost,
	itemInstanceDeleteGet,
	itemInstanceDeletePost,
	itemInstanceUpdateGet,
	itemInstanceUpdatePost,
	itemInstanceDetail,
	itemInstanceList,
};
