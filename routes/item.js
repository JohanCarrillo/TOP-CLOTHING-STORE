'use strict'

const { Router } = require('express');
const router = Router();

const itemController = require('../controllers/itemController');

router.get('/', itemController.itemList);

router.get('/create', itemController.itemCreateGet);
router.post('/create', itemController.itemCreatePost);

router.get('/:id/delete', itemController.itemDeleteGet);
router.delete('/:id/delete', itemController.itemDeleteDelete);

router.get('/:id/update', itemController.itemUpdateGet);
router.put('/:id/update', itemController.itemUpdatePut);

router.get('/:id', itemController.itemDetail);


module.exports = router;