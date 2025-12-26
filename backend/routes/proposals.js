

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { generateProposal, getProposal, updateProposal, downloadProposalPDF } = require('../controllers/proposals');

router.post('/generate', auth, generateProposal);
router.get('/:id', auth, getProposal);
router.put('/:id', auth, updateProposal);
router.get('/:id/pdf', auth, downloadProposalPDF);

module.exports = router;
