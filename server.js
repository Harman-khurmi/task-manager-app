const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/categories', require('./routes/categories'));

app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        time: new Date().toISOString()
    });
});

// SPA fallback — Express v5 compatible
app.use((req, res, next) => {
    if (!req.path.startsWith('/api/')) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
        next();
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
