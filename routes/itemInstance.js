'use strict'

const { Router } = require('express');
const router = Router();

const itemInstanceController = require('../controllers/itemInstanceController');

router.get('/', itemInstanceController.itemInstanceList);

router.get('/create', itemInstanceController.itemInstanceCreateGet);
router.post('/create', itemInstanceController.itemInstanceCreatePost);

router.get('/:id/delete', itemInstanceController.itemInstanceDeleteGet);
router.delete('/:id/delete', itemInstanceController.itemInstanceDeleteDelete);

router.get('/:id/update', itemInstanceController.itemInstanceUpdateGet);
router.put('/:id/update', itemInstanceController.itemInstanceUpdatePut);

router.get('/:id', itemInstanceController.itemInstanceDetail);

module.exports = router;