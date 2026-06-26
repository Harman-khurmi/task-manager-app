// const express = require('express');
// const router = express.Router();
// const db = require('../db/database');

// const getAllCategories = db.prepare(`
//   SELECT * FROM categories ORDER BY name ASC
// `);

// const getCategoryById = db.prepare(`
//   SELECT * FROM categories WHERE id = ?
// `);

// const createCategory = db.prepare(`
//   INSERT INTO categories (name) VALUES (?)
// `);

// const deleteCategory = db.prepare(`
//   DELETE FROM categories WHERE id = ?
// `);

// router.get('/', (req, res) => {
//     try {
//         const categories = getAllCategories.all();
//         res.json({ success: true, data: categories });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// });

// router.post('/', (req, res) => {
//     try {
//         const { name } = req.body;

//         if (!name || !name.trim()) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Category name is required'
//             });
//         }

//         const result = createCategory.run(name.trim());
//         const newCategory = getCategoryById.get(result.lastInsertRowid);

//         res.status(201).json({ success: true, data: newCategory });
//     } catch (error) {
//         if (error.message.includes('UNIQUE')) {
//             return res.status(409).json({
//                 success: false,
//                 message: 'Category already exists'
//             });
//         }

//         res.status(500).json({ success: false, message: error.message });
//     }
// });

// router.delete('/:id', (req, res) => {
//     try {
//         const category = getCategoryById.get(req.params.id);

//         if (!category) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Category not found'
//             });
//         }

//         deleteCategory.run(req.params.id);

//         res.json({
//             success: true,
//             message: 'Category deleted successfully'
//         });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const { getDb } = require('../db/database');

// GET /api/categories
router.get('/', async (req, res) => {
    try {
        const db = await getDb();
        const categories = await db.all('SELECT * FROM categories ORDER BY name ASC');
        res.json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/categories
router.post('/', async (req, res) => {
    try {
        const db = await getDb();
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ success: false, message: 'Category name is required' });
        }

        const result = await db.run('INSERT INTO categories (name) VALUES (?)', [name.trim()]);
        const newCategory = await db.get('SELECT * FROM categories WHERE id = ?', [result.lastID]);

        res.status(201).json({ success: true, data: newCategory });
    } catch (error) {
        if (error.message.includes('UNIQUE')) {
            return res.status(409).json({ success: false, message: 'Category already exists' });
        }
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE /api/categories/:id
router.delete('/:id', async (req, res) => {
    try {
        const db = await getDb();
        const existing = await db.get('SELECT * FROM categories WHERE id = ?', [req.params.id]);

        if (!existing) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        await db.run('DELETE FROM categories WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;