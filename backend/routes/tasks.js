const express = require('express');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { validateTask } = require('../middleware/validation');
const upload = require('../middleware/upload');

const router = express.Router();

// Protect all routes below
router.use(protect);

router.route('/')
  .get(getTasks)
  .post(upload.single('image'), validateTask, createTask);

router.route('/:id')
  .put(upload.single('image'), updateTask)
  .delete(deleteTask);

module.exports = router;
