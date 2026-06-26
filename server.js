// const express = require('express');
// const cors = require('cors');
// const path = require('path');

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/api/tasks', require('./routes/tasks'));
// app.use('/api/categories', require('./routes/categories'));

// app.get('/api/health', (req, res) => {
//     res.json({
//         success: true,
//         message: 'Server is running',
//         time: new Date().toISOString()
//     });
// });

// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// const PORT = 3000;
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });

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
        time: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Serve frontend for all other routes (SPA fallback) - Express v5 compatible
app.use((req, res, next) => {
    // If route is not handled by API, serve index.html
    if (!req.path.startsWith('/api/')) {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } else {
        next();
    }
});

// Only start server if not in serverless environment
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

// Export for Vercel serverless function
module.exports = app;