
const express = require('express');
const router = express.Router();
const flatController = require('../controllers/flatsController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Flat:
 *       type: object
 *       required:
 *         - title
 *         - location
 *         - price
 *         - landlordId
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the flat listing
 *         description:
 *           type: string
 *           description: Additional details about the flat
 *         location:
 *           type: string
 *           description: Address or area of the flat
 *         price:
 *           type: number
 *           description: Rent price of the flat
 *         landlordId:
 *           type: string
 *           description: ID of the landlord (user)
 *         tenantIds:
 *           type: array
 *           items:
 *             type: string
 *           description: IDs of current or past tenants
 *         preferences:
 *           type: array
 *           items:
 *             type: string
 *           description: Preferred tenant criteria (e.g., 'non-smoker', 'no pets')
 *         amenities:
 *           type: array
 *           items:
 *             type: string
 *           description: Amenities available (e.g., 'WiFi', 'Gym', 'Parking')
 *         availableFrom:
 *           type: string
 *           format: date
 *           description: Availability start date
 *         managerId:
 *           type: string
 *           description: ID of the property manager
 */

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
 *             $ref: '#/components/schemas/Flat'
 *     responses:
 *       201:
 *         description: Flat created successfully
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
 *         schema:
 *           type: string
 *         description: The ID of the flat
 *     responses:
 *       200:
 *         description: Flat data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Flat'
 *       404:
 *         description: Flat not found
 */
router.get('/:id', flatController.getFlatById);

/**
 * @swagger
 * /flats/filter:
 *   get:
 *     summary: Get flats with filtering options
 *     tags: [Flats]
 *     parameters:
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price
 *       - in: query
 *         name: amenities
 *         schema:
 *           type: string
 *         description: Comma-separated list of amenities (e.g., 'WiFi,Pool')
 *       - in: query
 *         name: preferences
 *         schema:
 *           type: string
 *         description: Comma-separated list of preferences (e.g., 'non-smoker')
 *     responses:
 *       200:
 *         description: List of filtered flats
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Flat'
 *       400:
 *         description: Invalid filter parameters
 */
router.get('/filter', flatController.getFilteredFlats);

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
 *         schema:
 *           type: string
 *         description: The ID of the flat to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Flat'
 *     responses:
 *       200:
 *         description: Updated flat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Flat'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Flat not found
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
 *         schema:
 *           type: string
 *         description: The ID of the flat to be deleted
 *     responses:
 *       200:
 *         description: Flat deleted successfully
 *       404:
 *         description: Flat not found
 */
router.delete('/:id', flatController.deleteFlat);

module.exports = router;
