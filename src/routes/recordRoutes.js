const express = require('express');
const { createRecord, getRecords, updateRecord, deleteRecord, getSummary } = require('../controllers/recordController');
const { authenticate, requireRole } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.get('/summary', requireRole(['Admin', 'Analyst']), getSummary);

router.post('/', requireRole(['Admin']), createRecord);
router.get('/', requireRole(['Admin', 'Analyst']), getRecords);
router.put('/:id', requireRole(['Admin']), updateRecord);
router.delete('/:id', requireRole(['Admin']), deleteRecord);

module.exports = router;