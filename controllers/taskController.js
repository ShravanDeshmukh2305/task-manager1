const { Task } = require('../models');

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, due_date } = req.body;
    const task = await Task.create({ title, description, status, priority, due_date, userId: req.userId });
    res.status(201).send(task);
  } catch (err) {
    res.status(500).send('Error creating task.');
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { userId: req.userId } });
    res.status(200).send(tasks);
  } catch (err) {
    res.status(500).send('Error retrieving tasks.');
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, status, priority, due_date } = req.body;
    const task = await Task.findByPk(taskId);

    if (!task || task.userId !== req.userId) return res.status(404).send('Task not found.');

    await task.update({ title, description, status, priority, due_date });
    res.status(200).send(task);
  } catch (err) {
    res.status(500).send('Error updating task.');
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findByPk(taskId);

    if (!task || task.userId !== req.userId) return res.status(404).send('Task not found.');

    await task.destroy();
    res.status(200).send('Task deleted successfully.');
  } catch (err) {
    res.status(500).send('Error deleting task.');
  }
};

exports.filterTasks = async (req, res) => {
  try {
    const { status, priority, due_date } = req.query;
    const filters = { userId: req.userId };
    if (status) filters.status = status;
    if (priority) filters.priority = priority;
    if (due_date) filters.due_date = due_date;

    const tasks = await Task.findAll({ where: filters });
    res.status(200).send(tasks);
  } catch (err) {
    res.status(500).send('Error filtering tasks.');
  }
};

exports.searchTasks = async (req, res) => {
  try {
    const { query } = req.query;
    const tasks = await Task.findAll({
      where: {
        userId: req.userId,
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } }
        ]
      }
    });
    res.status(200).send(tasks);
  } catch (err) {
    res.status(500).send('Error searching tasks.');
  }
};
