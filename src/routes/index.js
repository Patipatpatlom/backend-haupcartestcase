const express = require('express');
const carController = require('../controllers/car.controller');

const router = express.Router();

router.post('/cars', carController.create);
router.get('/cars', carController.getAll);
router.put('/cars/:id', carController.update);
router.delete('/cars/:id', carController.delete);
router.get('/cars/:id', carController.getById);


module.exports = router;
