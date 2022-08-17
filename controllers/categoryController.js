"use strict";

const async = require("async");
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

const Category = require("../models/category");
const Item = require("../models/item");

function categoryCreateGet(req, res, next) {
	res.render("category_form", { title: "Add New Category" });
}

const categoryCreatePost = [
	body("name", "Category name required").trim().isLength({ min: 1 }).escape(),

	function (req, res, next) {
		const errors = validationResult(req);

		const category = new Category({ name: req.body.name });

		if (!errors.isEmpty()) {
			res.render("category_form", {
				title: "Create Category",
				category: category,
				errors: errors.array(),
			});
			return;
		} else {
			Category.findOne({
				name: { $regex: new RegExp(req.body.name, "i") },
			}).exec((err, found_category) => {
				if (err) {
					return next(err);
				}
				if (found_category) {
					res.redirect(found_category.url);
				} else {
					category.save(err => {
						if (err) return next(err);
						res.redirect(category.url);
					});
				}
			});
		}
	},
];

function categoryDeleteGet(req, res, next) {
	async.parallel(
		{
			category(callback) {
				Category.findById(req.params.id).exec(callback);
			},
			items(callback) {
				Item.find({ category: req.params.id }).exec(callback);
			},
		},
		function (err, results) {
			if (err) return next(err);
			if (results.category == null) {
				res.redirect("/category");
			}
			res.render("category_delete", {
				title: "Delete Genre",
				category: results.category,
				items: results.items,
			});
		}
	);
}

function categoryDeletePost(req, res, next) {
	async.parallel(
		{
			category: function (callback) {
				Category.findById(req.body.categoryId).exec(callback);
			},
			items: function (callback) {
				Item.find({ category: req.body.categoryId }).exec(callback);
			},
		},
		function (err, results) {
			if (err) return next(err);
			if (results.items.length > 0) {
				res.render("category_delete", {
					title: "Delete Category",
					category: results.category,
					items: results.items,
				});
				return;
			} else {
				Category.findByIdAndRemove(req.body.categoryId, err => {
					if (err) return next(err);
					res.redirect("/category");
				});
			}
		}
	);
}

function categoryUpdateGet(req, res, next) {
	Category.findById(req.params.id).exec((err, category) => {
		if (err) return next(err);
		if (category == null) {
			const err = new Error("Category not found");
			err.status = 404;
			return next(err);
		}
		res.render("category_form", {
			title: "Category Update",
			category: category,
		});
	});
}

const categoryUpdatePost = [
	body("name", "Name must not be empty").trim().isLength({ min: 1 }).escape(),

	function (req, res, next) {
		const errors = validationResult(req);
		const category = new Category({
			name: req.body.name,
			_id: req.params.id,
		});

		if (!errors.isEmpty()) {
			res.render("category_form", {
				title: "Category Update",
				category: category,
				errors: errors.array(),
			});
		} else {
			Category.findByIdAndUpdate(
				req.params.id,
				category,
				{},
				(err, updatedCategory) => {
					if (err) return next(err);
					res.redirect(updatedCategory.url);
				}
			);
		}
	},
];

function categoryDetail(req, res, next) {
	const id = mongoose.Types.ObjectId(req.params.id);

	async.parallel(
		{
			category(callback) {
				Category.findById(id).exec(callback);
			},
			items(callback) {
				Item.find({ category: id }).exec(callback);
			},
		},
		(err, results) => {
			if (err) return next(err);
			if (results.category == null) {
				const err = new Error("Category not found");
				err.status = 404;
				return next(err);
			}
			res.render("category_detail", {
				title: "Category Details",
				category: results.category,
				items: results.items,
			});
		}
	);
}

function categoryList(req, res, next) {
	Category.find()
		.sort({ name: 1 })
		.exec((err, categories) => {
			if (err) return next(err);
			res.render("category_list", {
				title: "Category List",
				category_list: categories,
			});
		});
}

module.exports = {
	categoryCreateGet,
	categoryCreatePost,
	categoryDeleteGet,
	categoryDeletePost,
	categoryUpdateGet,
	categoryUpdatePost,
	categoryDetail,
	categoryList,
};
