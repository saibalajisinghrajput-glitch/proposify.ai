const Project = require('../models/Project');


const getProjects = async (req, res) => {
  try {
    console.log(`🔍 GET PROJECTS: User ${req.user.id} requesting projects`);
    const projects = await Project.find({ user: req.user.id });
    console.log(`✅ GET PROJECTS: Found ${projects.length} projects for user ${req.user.id}`);
    res.json(projects);
  } catch (error) {
    console.error('❌ GET PROJECTS ERROR:', error);
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
    console.error('User ID:', req.user?.id);
    
    // Enhanced error classification
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Invalid user ID format',
        field: 'userId',
        value: req.user.id
      });
    }
    
    res.status(500).json({ 
      message: 'Failed to retrieve projects',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Database error',
      timestamp: new Date().toISOString()
    });
  }
};

const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};




const createProject = async (req, res) => {
  try {
    console.log('=== CREATE PROJECT DEBUG ===');
    console.log('User from token:', req.user);
    console.log('Request body:', req.body);
    
    // Validate required fields
    const requiredFields = ['name', 'clientName', 'clientCompany', 'clientPhone', 'clientIndustry', 'country', 'budget', 'timeline', 'serviceType'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      return res.status(400).json({ 
        message: 'Missing required fields', 
        fields: missingFields 
      });
    }

    const { 
      name, description, clientName, clientCompany, clientPhone, clientEmail, 
      clientIndustry, customIndustry, country, budget, 
      timeline, serviceType, customService, currency 
    } = req.body;

    console.log('Creating project with user ID:', req.user.id);

    // Create project object
    const projectData = {
      name,
      description,
      clientName,
      clientCompany,
      clientPhone,
      clientEmail,
      clientIndustry,
      customIndustry,
      country,
      budget,
      currency: currency || 'INR',
      timeline,
      serviceType,
      customService,
      user: req.user.id
    };

    console.log('Project data:', projectData);

    const project = new Project(projectData);
    console.log('Project instance created, attempting to save...');

    const savedProject = await project.save();
    console.log('Project saved successfully:', savedProject._id);
    
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('=== CREATE PROJECT ERROR ===');
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.keys(error.errors).map(field => ({
        field,
        message: error.errors[field].message
      }));
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: validationErrors 
      });
    }
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Invalid data format', 
        field: error.path,
        value: error.value 
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Duplicate entry detected',
        field: Object.keys(error.keyPattern)[0]
      });
    }
    
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
};
