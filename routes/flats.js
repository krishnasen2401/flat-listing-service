
const express = require('express');
const router = express.Router();
const flatController = require('../controllers/flatsController');

/**
 * @swagger
 * /flats:
 *   post:
 *     summary: Create a new flat
 *     tags: [Flats]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Flat created
 */
router.post('/', flatController.createFlat);

/**
 * @swagger
 * /flats:
 *   get:
 *     summary: Get all flats
 *     tags: [Flats]
 *     responses:
 *       200:
 *         description: List of flats
 */
router.get('/', flatController.getAllFlats);

/**
 * @swagger
 * /flats/{id}:
 *   get:
 *     summary: Get a flat by ID
 *     tags: [Flats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Flat data
 */
router.get('/:id', flatController.getFlatById);

/**
 * @swagger
 * /flats/{id}:
 *   put:
 *     summary: Update a flat
 *     tags: [Flats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Updated flat
 */
router.put('/:id', flatController.updateFlat);

/**
 * @swagger
 * /flats/{id}:
 *   delete:
 *     summary: Delete a flat
 *     tags: [Flats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Flat deleted
 */
router.delete('/:id', flatController.deleteFlat);

module.exports = router;
