'use strict'

const { Router } = require('express');
const router = Router();

const clothCollectionController = require('../controllers/clothCollectionController');

router.get('/', clothCollectionController.clothCollectionList);

router.get('/create', clothCollectionController.clothCollectionCreateGet);
router.post('/create', clothCollectionController.clothCollectionCreatePost);

router.get('/:id/delete', clothCollectionController.clothCollectionDeleteGet);
router.delete('/:id/delete', clothCollectionController.clothCollectionDeleteDelete);

router.get('/:id/update', clothCollectionController.clothCollectionUpdateGet);
router.put('/:id/update', clothCollectionController.clothCollectionUpdatePut);

router.get('/:id', clothCollectionController.clothCollectionDetail);


module.exports = router;