'use strict'

const { Router } = require('express');
const router = Router();

const clothCollectionController = require('../controllers/clothCollectionController');

router.get('/', clothCollectionController.clothCollectionList);

router.get('/create', clothCollectionController.clothCollectionCreateGet);
router.post('/create', clothCollectionController.clothCollectionCreatePost);

router.get('/:id/delete', clothCollectionController.clothCollectionDeleteGet);
router.post('/:id/delete', clothCollectionController.clothCollectionDeletePost);

router.get('/:id/update', clothCollectionController.clothCollectionUpdateGet);
router.post('/:id/update', clothCollectionController.clothCollectionUpdatePost);

router.get('/:id', clothCollectionController.clothCollectionDetail);


module.exports = router;