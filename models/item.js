"use strict";

const { model, Schema } = require("mongoose");

const ItemSchema = new Schema({
	name: { type: String, required: true },
	description: { type: String, required: true, maxLength: 100, minLength: 5 },
	price: { type: Number, required: true },
	cloth_collection: { type: Schema.Types.ObjectId, ref: "ClothCollection" },
	category: { type: Schema.Types.ObjectID, ref: "Category" },
	sizes: { type: [String], default: ["S", "L"] },
});

ItemSchema.virtual("url").get(function () {
	return "/item/" + this.id;
});

module.exports = model("Item", ItemSchema);
