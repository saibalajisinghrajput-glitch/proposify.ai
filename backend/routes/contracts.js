
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { generateContract, getContract, updateContract, downloadContractPDF } = require('../controllers/contracts');

router.post('/generate', auth, generateContract);
router.get('/:id', auth, getContract);
router.put('/:id', auth, updateContract);
router.get('/:id/download', auth, downloadContractPDF);

module.exports = router;
