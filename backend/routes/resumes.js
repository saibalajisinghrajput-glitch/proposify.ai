

const express = require('express');
const router = express.Router();
const { 
  generateResume, 
  getResume, 
  getUserResumes, 
  updateResume, 
  deleteResume,
  generateResumePDF,
  downloadResumePDF
} = require('../controllers/resumes');

const auth = require('../middleware/auth');

// Demo routes (no auth required)
router.post('/demo/generate', generateResume);

// Authenticated routes
router.use(auth);
router.post('/', generateResume);
router.get('/', getUserResumes);
router.get('/:id', getResume);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);

// PDF endpoints
router.post('/:id/pdf', generateResumePDF);
router.get('/:id/pdf', downloadResumePDF);

module.exports = router;
