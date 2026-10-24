import mongoose from "mongoose";
import Task from "../models/Task.js";

const priorities = new Set(["low", "medium", "high"]);
const statuses = new Set(["pending", "completed"]);
const taskFields = ["title", "description", "status", "priority", "dueDate"];

function validateTaskBody(body, { requireTitle = false, statusOnly = false } = {}) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    const error = new Error("Request body must be a JSON object.");
    error.statusCode = 400;
    throw error;
  }

  if (statusOnly) {
    if (!statuses.has(body.status)) {
      const error = new Error('Status must be either "pending" or "completed".');
      error.statusCode = 400;
      throw error;
    }
    return { status: body.status };
  }

  const values = {};
  for (const field of taskFields) {
    if (Object.hasOwn(body, field)) {
      values[field] = body[field];
    }
  }

  if (requireTitle && !Object.hasOwn(values, "title")) {
    const error = new Error("Title is required.");
    error.statusCode = 400;
    throw error;
  }

  if (Object.hasOwn(values, "title")) {
    if (typeof values.title !== "string" || values.title.trim().length === 0) {
      const error = new Error("Please enter a task title.");
      error.statusCode = 400;
      throw error;
    }
    values.title = values.title.trim();
    if (values.title.length > 120) {
      const error = new Error("Title must be 120 characters or fewer.");
      error.statusCode = 400;
      throw error;
    }
  }

  if (Object.hasOwn(values, "description")) {
    if (typeof values.description !== "string") {
      const error = new Error("Description must be text.");
      error.statusCode = 400;
      throw error;
    }
    values.description = values.description.trim();
    if (values.description.length > 2000) {
      const error = new Error("Description must be 2,000 characters or fewer.");
      error.statusCode = 400;
      throw error;
    }
  }

  if (Object.hasOwn(values, "priority") && !priorities.has(values.priority)) {
    const error = new Error('Priority must be "low", "medium", or "high".');
    error.statusCode = 400;
    throw error;
  }

  if (Object.hasOwn(values, "status") && !statuses.has(values.status)) {
    const error = new Error('Status must be either "pending" or "completed".');
    error.statusCode = 400;
    throw error;
  }

  if (Object.hasOwn(values, "dueDate")) {
    if (values.dueDate === "" || values.dueDate === null) {
      values.dueDate = null;
    } else if (Number.isNaN(Date.parse(values.dueDate))) {
      const error = new Error("Please provide a valid due date.");
      error.statusCode = 400;
      throw error;
    }
  }

  return values;
}

function validateId(id) {
  if (!mongoose.isValidObjectId(id)) {
    const error = new Error("The task ID is invalid.");
    error.statusCode = 400;
    throw error;
  }
}

function sendTask(res, task, statusCode = 200) {
  res.status(statusCode).json({ success: true, data: task });
}

export async function getTasks(req, res) {
  const tasks = await Task.find().sort({ createdAt: -1 });
  sendTask(res, tasks);
}

export async function getTask(req, res) {
  validateId(req.params.id);
  const task = await Task.findById(req.params.id);
  if (!task) {
    const error = new Error("Task not found.");
    error.statusCode = 404;
    throw error;
  }
  sendTask(res, task);
}

export async function createTask(req, res) {
  const values = validateTaskBody(req.body);
  if (!values.title) {
    const error = new Error("Please enter a task title.");
    error.statusCode = 400;
    throw error;
  }
  const task = await Task.create(values);
  sendTask(res, task, 201);
}

export async function updateTask(req, res) {
  validateId(req.params.id);
  const values = validateTaskBody(req.body, { requireTitle: true });
  const task = await Task.findByIdAndUpdate(req.params.id, values, {
    new: true,
    runValidators: true,
  });
  if (!task) {
    const error = new Error("Task not found.");
    error.statusCode = 404;
    throw error;
  }
  sendTask(res, task);
}

export async function updateTaskStatus(req, res) {
  validateId(req.params.id);
  const values = validateTaskBody(req.body, { statusOnly: true });
  const task = await Task.findByIdAndUpdate(req.params.id, values, {
    new: true,
    runValidators: true,
  });
  if (!task) {
    const error = new Error("Task not found.");
    error.statusCode = 404;
    throw error;
  }
  sendTask(res, task);
}

export async function deleteTask(req, res) {
  validateId(req.params.id);
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) {
    const error = new Error("Task not found.");
    error.statusCode = 404;
    throw error;
  }
  res.status(200).json({ success: true, data: task, message: "Task deleted." });
}
