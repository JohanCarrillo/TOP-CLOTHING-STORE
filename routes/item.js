"use strict";

const { Router } = require("express");
const router = Router();

const itemController = require("../controllers/itemController");

router.get("/", itemController.itemList);

router.get("/create", itemController.itemCreateGet);
router.post("/create", itemController.itemCreatePost);

router.get("/:id/delete", itemController.itemDeleteGet);
router.post("/:id/delete", itemController.itemDeletePost);

router.get("/:id/update", itemController.itemUpdateGet);
router.post("/:id/update", itemController.itemUpdatePost);

router.get("/:id", itemController.itemDetail);

module.exports = router;
