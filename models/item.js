"use strict";

const { model, Schema } = require("mongoose");

const ItemSchema = new Schema({
	name: { type: String, required: true },
	description: { type: String, required: true, maxLength: 100, minLength: 5 },
	price: { type: Number, required: true },
	cloth_collection: { type: Schema.Types.ObjectId, ref: "ClothCollection" },
	category: { type: Schema.Types.ObjectID, ref: "Category" },
	sizes: { type: [String], required: true },
});

ItemSchema.virtual("url").get(function () {
	console.log("/item/" + this.id);
	return "/item/" + this.id;
});

module.exports = model("Item", ItemSchema);
