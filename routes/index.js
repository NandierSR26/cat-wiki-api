const { Router } = require('express');
const { searchBreed, getMorePhotos, topBreeds, getBreeds, getAllBreeds, getMainPhoto } = require('../controllers/catsController');

const router = Router();

router.get('/get-breeds/:term', getBreeds)

router.get('/breeds/search/', searchBreed);

router.get('/breeds-photos/:breed', getMorePhotos);

router.get('/top-breeds/:limit', topBreeds);

router.get('/breeds', getAllBreeds);

module.exports = router