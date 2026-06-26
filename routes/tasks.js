const express = require('express');
const router = express.Router();
const { getDb } = require('../db/database');

// GET /api/tasks
router.get('/', async (req, res) => {
    try {
        const db = await getDb();
        const { status, priority, category_id, page = 1, limit = 5 } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(limit);

        let whereConditions = [];
        let params = {};

        if (status) {
            whereConditions.push('tasks.status = @status');
            params['@status'] = status;
        }
        if (priority) {
            whereConditions.push('tasks.priority = @priority');
            params['@priority'] = priority;
        }
        if (category_id) {
            whereConditions.push('tasks.category_id = @category_id');
            params['@category_id'] = category_id;
        }

        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

        const tasks = await db.all(`
            SELECT tasks.*, categories.name AS category_name
            FROM tasks
            LEFT JOIN categories ON tasks.category_id = categories.id
            ${whereClause}
            ORDER BY tasks.created_at DESC
            LIMIT @limit OFFSET @offset
        `, {
            ...params,
            '@limit': parseInt(limit),
            '@offset': offset
        });

        const countResult = await db.get(`
            SELECT COUNT(*) as total
            FROM tasks
            ${whereClause}
        `, params);

        const total = countResult.total;
        const totalPages = Math.ceil(total / parseInt(limit));

        res.json({
            success: true,
            data: tasks,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/tasks/stats
router.get('/stats', async (req, res) => {
    try {
        const db = await getDb();
        const stats = await db.get(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
        SUM(CASE WHEN status = 'in-progress' THEN 1 ELSE 0 END) AS in_progress,
        SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) AS done,
        SUM(CASE WHEN priority = 'high' THEN 1 ELSE 0 END) AS high_priority
      FROM tasks
    `);
        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/tasks/search?q=keyword
router.get('/search', async (req, res) => {
    try {
        const db = await getDb();
        const q = `%${req.query.q || ''}%`;
        const { page = 1, limit = 5 } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        const tasks = await db.all(`
            SELECT tasks.*, categories.name AS category_name
            FROM tasks
            LEFT JOIN categories ON tasks.category_id = categories.id
            WHERE tasks.title LIKE ? OR tasks.description LIKE ?
            ORDER BY tasks.created_at DESC
            LIMIT ? OFFSET ?
        `, [q, q, parseInt(limit), offset]);

        const countResult = await db.get(`
            SELECT COUNT(*) as total
            FROM tasks
            WHERE tasks.title LIKE ? OR tasks.description LIKE ?
        `, [q, q]);

        const total = countResult.total;
        const totalPages = Math.ceil(total / parseInt(limit));

        res.json({
            success: true,
            data: tasks,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                totalPages
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/tasks/:id
router.get('/:id', async (req, res) => {
    try {
        const db = await getDb();
        const task = await db.get(`
      SELECT tasks.*, categories.name AS category_name
      FROM tasks
      LEFT JOIN categories ON tasks.category_id = categories.id
      WHERE tasks.id = ?
    `, [req.params.id]);

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        res.json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/tasks
router.post('/', async (req, res) => {
    try {
        const db = await getDb();
        const {
            title,
            description = '',
            status = 'pending',
            priority = 'medium',
            due_date = null,
            category_id = null
        } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ success: false, message: 'Title is required' });
        }

        const result = await db.run(`
      INSERT INTO tasks (title, description, status, priority, due_date, category_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [title.trim(), description, status, priority, due_date, category_id || null]);

        const newTask = await db.get(`
      SELECT tasks.*, categories.name AS category_name
      FROM tasks
      LEFT JOIN categories ON tasks.category_id = categories.id
      WHERE tasks.id = ?
    `, [result.lastID]);

        res.status(201).json({ success: true, data: newTask });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// PUT /api/tasks/:id
router.put('/:id', async (req, res) => {
    try {
        const db = await getDb();
        const existing = await db.get('SELECT * FROM tasks WHERE id = ?', [req.params.id]);

        if (!existing) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        const {
            title = existing.title,
            description = existing.description,
            status = existing.status,
            priority = existing.priority,
            due_date = existing.due_date,
            category_id = existing.category_id
        } = req.body;

        if (!title || !String(title).trim()) {
            return res.status(400).json({ success: false, message: 'Title is required' });
        }

        await db.run(`
      UPDATE tasks
      SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, category_id = ?
      WHERE id = ?
    `, [String(title).trim(), description, status, priority, due_date, category_id || null, req.params.id]);

        const updated = await db.get(`
      SELECT tasks.*, categories.name AS category_name
      FROM tasks
      LEFT JOIN categories ON tasks.category_id = categories.id
      WHERE tasks.id = ?
    `, [req.params.id]);

        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE /api/tasks/:id
router.delete('/:id', async (req, res) => {
    try {
        const db = await getDb();
        const existing = await db.get('SELECT * FROM tasks WHERE id = ?', [req.params.id]);

        if (!existing) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        await db.run('DELETE FROM tasks WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;