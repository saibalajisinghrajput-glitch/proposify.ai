

const express = require('express');
const router = express.Router();
const { 
  generateOfferLetter, 
  getOfferLetter, 
  getUserOfferLetters, 
  updateOfferLetter, 
  deleteOfferLetter,
  generateOfferLetterPDF,
  downloadOfferLetterPDF
} = require('../controllers/offerLetters');

const auth = require('../middleware/auth');

// Demo routes (no auth required)
router.post('/demo/generate', generateOfferLetter);

// Authenticated routes
router.use(auth);
router.post('/', generateOfferLetter);
router.get('/', getUserOfferLetters);
router.get('/:id', getOfferLetter);
router.put('/:id', updateOfferLetter);
router.delete('/:id', deleteOfferLetter);

// PDF endpoints
router.post('/:id/pdf', generateOfferLetterPDF);
router.get('/:id/pdf', downloadOfferLetterPDF);

module.exports = router;
