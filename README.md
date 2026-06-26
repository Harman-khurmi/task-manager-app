# TaskMaster Pro

A professional, modern task management application built with Node.js, Express, SQLite, and vanilla JavaScript. Features a beautiful dark theme, responsive design, pagination, and comprehensive filtering capabilities.

**🌐 Live Demo**: [Coming Soon - Deploy to Vercel](https://vercel.com)

## ✨ Features

### Core Functionality
- ✅ **Full CRUD Operations** - Create, read, update, and delete tasks
- 🔍 **Advanced Search** - Real-time search across task titles and descriptions
- 🎯 **Multi-Filter System** - Filter by status, priority, and category
- 📄 **Pagination** - 5 tasks per page for optimal performance
- 📊 **Live Statistics** - Real-time overview of task counts
- 🏷️ **Categories** - Organize tasks with customizable categories

### User Experience
- 🎨 **Modern Dark Theme** - Professional, eye-friendly design
- 📱 **Fully Responsive** - Perfect on desktop, tablet, and mobile
- 🪟 **Modal Interface** - Clean popup for creating/editing tasks
- ⚡ **Instant Feedback** - Toast notifications for all actions
- 🎯 **Single-Page View** - No excessive scrolling on desktop
- ♿ **Accessible** - Keyboard navigation and screen reader friendly

### Technical Highlights
- 🚀 **Fast & Lightweight** - Vanilla JavaScript, no frameworks
- 💾 **SQLite Database** - Reliable local data storage
- 🎭 **RESTful API** - Clean, well-structured backend
- 🔒 **Input Validation** - Secure data handling
- 📐 **Pixel Perfect** - Attention to design details

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Local Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd taskmaster-pro
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

### Development Mode

For auto-reload during development:
```bash
npm run dev
```

### Deploy to Vercel

**Quick Deploy** (2 minutes):
```bash
npm install -g vercel
vercel login
vercel --prod
```

**📖 Detailed Deployment Guide**: See [QUICK_START.md](QUICK_START.md) or [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/taskmaster-pro)

## 📁 Project Structure

```
taskmaster-pro/
├── db/
│   ├── database.js       # Database connection
│   ├── schema.sql        # Database schema
│   └── tasks.db          # SQLite database file
├── routes/
│   ├── tasks.js          # Task API routes
│   └── categories.js     # Category API routes
├── public/
│   ├── index.html        # Main HTML file
│   ├── style.css         # Styles and responsive design
│   └── script.js         # Frontend logic
├── server.js             # Express server setup
├── package.json          # Project dependencies
└── README.md            # Documentation
```

## 🎨 UI/UX Improvements

### Before vs After

**Previous Issues:**
- Search and filters took too much space
- Task list at the bottom requiring scroll
- Add task form always visible
- Poor mobile responsiveness
- White dropdowns on dark theme
- No pagination (all tasks loaded at once)

**New Design:**
- ✅ Filters in left sidebar for easy access
- ✅ Task list prominently displayed in center
- ✅ Modal popup for task creation/editing
- ✅ Overview stats in compact top bar
- ✅ Fully styled dark theme dropdowns
- ✅ Pagination (5 tasks per page)
- ✅ Single-page view on desktop
- ✅ Perfect mobile responsiveness

## 🛠️ API Endpoints

### Tasks

#### Get All Tasks (with pagination)
```
GET /api/tasks?page=1&limit=5&status=pending&priority=high&category_id=1
```

#### Get Task by ID
```
GET /api/tasks/:id
```

#### Search Tasks
```
GET /api/tasks/search?q=keyword&page=1&limit=5
```

#### Get Task Statistics
```
GET /api/tasks/stats
```

#### Create Task
```
POST /api/tasks
Content-Type: application/json

{
  "title": "Task Title",
  "description": "Task Description",
  "status": "pending",
  "priority": "medium",
  "due_date": "2026-12-31",
  "category_id": 1
}
```

#### Update Task
```
PUT /api/tasks/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "done"
}
```

#### Delete Task
```
DELETE /api/tasks/:id
```

### Categories

#### Get All Categories
```
GET /api/categories
```

## 📱 Responsive Breakpoints

- **Desktop**: > 1024px - Full layout with sidebar
- **Tablet**: 768px - 1024px - Stacked layout, adjusted spacing
- **Mobile**: < 768px - Single column, touch-optimized

## 🎯 Key Features Explained

### Pagination
- Default: 5 tasks per page
- Server-side pagination for performance
- Smart page navigation with ellipsis
- Maintains filters across pages

### Modal System
- Overlay with backdrop blur
- Smooth animations
- Keyboard ESC to close
- Click outside to close
- Prevents body scroll when open

### Filter System
- Real-time filter application
- Combines multiple filters
- Clear filters button
- Maintains pagination state

### Search Functionality
- Searches titles and descriptions
- Instant results
- Works with pagination
- Press Enter or click button

## 🔧 Customization

### Changing Items Per Page
Edit `public/script.js`:
```javascript
const result = await api(`${API_TASKS}?page=${page}&limit=10`); // Change 5 to 10
```

### Theme Colors
Edit `public/style.css` variables:
```css
:root {
  --accent: #6366f1; /* Primary color */
  --success: #10b981; /* Success color */
  --danger: #ef4444;  /* Danger color */
}
```

## 🐛 Troubleshooting

### Server won't start
- Ensure port 3000 is available
- Check Node.js version (should be v14+)
- Run `npm install` to ensure dependencies are installed

### Database issues
- Delete `db/tasks.db` to reset
- Database will be recreated on next server start

### Styling issues
- Clear browser cache
- Check browser console for errors
- Ensure all files are properly served

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please create an issue in the repository.

---

Built with ❤️ using Node.js, Express, SQLite, and modern web technologies.
