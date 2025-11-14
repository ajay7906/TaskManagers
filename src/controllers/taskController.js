const Task = require('../models/Task');
const User = require('../models/User');

async function invalidateTaskCache(req) {
    try {
        const redis = req.app.get("redis");
        if (!redis) return;
        // naive approach: delete keys with prefix "cache:/api/tasks"
        const keys = await redis.keys("cache:/api/tasks*");
        if (keys && keys.length) await redis.del(keys);
    } catch (err) {
        console.error("Cache invalidation error:", err);
    }
}

exports.createTask = async (req, res) => {
    try {
        const { title, description, dueDate, priority, assignee } = req.body;
        const creatorId = req.user.id;
        const task = new Task({
            title,
            description,
            dueDate,
            priority,
            creator: creatorId,
            assignee,

        })
        await task.save();
        await task.populate("creator", "username email")
        await invalidateTaskCache(req);
        const io = req.app.get("io");
        if (io) {
            io.to(`user:${req.user.id}`).emit("task:created", task);
            if (task.assignee) io.to(`user:${task.assignee}`).emit("task:assigned", task);
        }
        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        console.error('Create Task error:', error);
        res.status(500).json({ message: 'Server error during task creation' });

    }
}

exports.getAllTasks = async (req, res) => {
    try {
        const { status, priority, assignee, page = 1, limit = 10, q } = req.query;
        let filter = {};
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (assignee) filter.assignee = assignee;

        if (q) {
            filter.$text = { $search: q }
        }

        if (!req.user.roles.includes("admin") && !req.user.roles.includes("manager")) {
            filter.$or = [{ creator: req.user.id }, { assignee: req.user.id }];
        }

        const tasks = await Task.find(filter)
            .populate('creator', 'username email')
            .populate('assignee', 'username email')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));


        const total = await Task.countDocuments(filter);
        res.status(200).json({ tasks, total, page: Number(page), limit });
    } catch (error) {
        console.error('Get Tasks error:', error);
        res.status(500).json({ message: 'Server error during fetching tasks' });

    }
}

exports.getTaskById = async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findById(taskId)
            .populate('creator', 'username email')
            .populate('assignee', 'username email');

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (!req.user.roles.includes("admin") && !req.user.roles.includes("manager")) {
            if (task.creator.toString() !== req.user.id && task.assignee?.toString() !== req.user.id) {
                return res.status(403).json({ message: 'Access denied' });
            }
        }

        res.status(200).json({ task });

    } catch (error) {
        console.error('Get Task by ID error:', error);
        res.status(500).json({ message: 'Server error during fetching task by ID' });

    }
}


exports.updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        if (!req.user.roles.includes("admin") && !req.user.roles.includes("manager")) {
            if (task.creator.toString() !== req.user.id && task.assignee?.toString() !== req.user.id) {
                return res.status(403).json({ message: 'Access denied' });
            }
        }

        Object.assign(task, req.body);
        await task.save();

        await task.populate("creator", "username email")

        await invalidateTaskCache(req);
        const io = req.app.get("io");
        if (io) {
            io.to(`user:${task.creator}`).emit("task:updated", task);
            if (task.assignee) io.to(`user:${task.assignee}`).emit("task:updated", task);
        }
        res.status(200).json({ message: 'Task updated successfully', task });

    } catch (error) {
        console.error('Update Task error:', error);
        res.status(500).json({ message: 'Server error during updating task' });

    }
}


exports.deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        if (!req.user.roles.includes("admin") && !req.user.roles.includes("manager")) {
            if (task.creator.toString() !== req.user.id && task.assignee.toString() !== req.user.id) {
                return res.status(403).json({ message: 'Access denied' });
            }
        }

        await task.remove();
        await invalidateTaskCache(req);

        const io = req.app.get("io");
        if (io) {
            io.to(`user:${task.creator}`).emit("task:deleted", { id: task._id });
            if (task.assignee) io.to(`user:${task.assignee}`).emit("task:deleted", { id: task._id });
        }

        res.status(200).json({ message: 'Task deleted successfully' });

    } catch (error) {
        console.error('Delete Task error:', error);
        res.status(500).json({ message: 'Server error during deleting task' });

    }
}


exports.assignTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        const { assignee } = req.body;
        if (!req.user.roles.includes("admin") && !req.user.roles.includes("manager") && !task.creator.equals(req.user.id)) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const user = await User.findById(assignee);
        if (!user) {
            return res.status(404).json({ message: 'Assignee user not found' });
        }
        task.assignee = assignee;
        await task.save();

        await task.populate("assignee", "username email")

        await invalidateTaskCache(req);

        const io = req.app.get("io");
        if (io) {
            io.to(`user:${user._id}`).emit("task:assigned", task);
            io.to(`user:${task.creator}`).emit("task:assigned", task);
        }
        res.status(200).json({ message: 'Task assigned successfully', task });

    } catch (error) {
        console.error('Assign Task error:', error);
        res.status(500).json({ message: 'Server error during assigning task' });

    }
}


