'use strict'

const async = require('async');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

const Category = require('../models/category');

function categoryCreateGet (req, res, next) {
	res.send('NOT IMPLEMENTED: category create get');
}

function categoryCreatePost(req, res, next) {
	res.send('NOT IMPLEMENTED: category create post');
}

function categoryDeleteGet(req, res, next) {
	res.send('NOT IMPLEMENTED: category delete get');
}

function categoryDeleteDelete(req, res, next) {
	res.send('NOT IMPLEMENTED: category delete delete');
}

function categoryUpdateGet(req, res, next) {
	res.send('NOT IMPLEMENTED: category update get');
}

function categoryUpdatePut(req, res, next) {
	res.send('NOT IMPLEMENTED: category update put');
}

function categoryDetail(req, res, next) {
	res.send('NOT IMPLEMENTED: category detail');
}

function categoryList(req, res, next) {
	
	Category.find()
		.sort({ name: 1 })
		.exec((err, categories) => {
			if (err) return next(err);
			res.render('category_list', {
				title: 'Category List',
				category_list: categories
			});
		});
}


module.exports = {
	categoryCreateGet,
	categoryCreatePost,
	categoryDeleteGet,
	categoryDeleteDelete,
	categoryUpdateGet,
	categoryUpdatePut,
	categoryDetail,
	categoryList
}