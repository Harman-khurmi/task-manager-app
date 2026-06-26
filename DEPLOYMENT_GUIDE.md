# TaskMaster Pro - Vercel Deployment Guide

## 🚀 Complete Deployment Guide

This guide will walk you through deploying TaskMaster Pro to Vercel with a fully functional backend, frontend, and database.

---

## ⚠️ Important Note About SQLite on Vercel

**SQLite Limitation**: Vercel's serverless functions use ephemeral file systems. This means:
- Data stored in SQLite will **reset on each deployment**
- Data may be **lost between function cold starts**
- SQLite on Vercel is only suitable for **demos and testing**

### 📊 For Production Use, Consider These Alternatives:

1. **Vercel Postgres** (Recommended)
   - Managed PostgreSQL database
   - Persistent storage
   - Free tier available
   - [Learn more](https://vercel.com/docs/storage/vercel-postgres)

2. **Turso** (SQLite-compatible)
   - Serverless SQLite database
   - Edge-hosted
   - Free tier: 500 databases
   - [Learn more](https://turso.tech)

3. **PlanetScale** (MySQL)
   - Serverless MySQL database
   - Free tier available
   - [Learn more](https://planetscale.com)

4. **Supabase** (PostgreSQL)
   - Open-source Firebase alternative
   - Free tier available
   - [Learn more](https://supabase.com)

---

## 📋 Pre-Deployment Checklist

### ✅ Files Ready for Deployment:
- [x] `server.js` - Configured for serverless
- [x] `vercel.json` - Vercel configuration
- [x] `.gitignore` - Ignore unnecessary files
- [x] `package.json` - Node version specified
- [x] All routes properly configured
- [x] Database initialization script
- [x] Frontend assets in `/public`

### ✅ Code Review Complete:
- [x] No hardcoded sensitive data
- [x] Environment variables supported
- [x] Error handling in place
- [x] CORS configured
- [x] API routes tested
- [x] Frontend responsive
- [x] No console errors

---

## 🎯 Deployment Steps

### Step 1: Prepare Your Repository

1. **Initialize Git (if not already done)**
```bash
git init
git add .
git commit -m "Initial commit - TaskMaster Pro ready for deployment"
```

2. **Push to GitHub/GitLab/Bitbucket**
```bash
# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/taskmaster-pro.git
git branch -M main
git push -u origin main
```

---

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Follow the prompts:**
   - Set up and deploy? `Y`
   - Which scope? (Select your account)
   - Link to existing project? `N`
   - What's your project's name? `taskmaster-pro`
   - In which directory is your code located? `./`
   - Want to override the settings? `N`

5. **Deploy to Production**
```bash
vercel --prod
```

#### Option B: Using Vercel Dashboard

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

2. **Click "Add New Project"**

3. **Import Your Git Repository**
   - Connect your GitHub/GitLab/Bitbucket account
   - Select your repository

4. **Configure Project**
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: (leave empty or use default)
   - **Output Directory**: `public`
   - **Install Command**: `npm install`

5. **Environment Variables** (Optional for this SQLite version)
   - `NODE_ENV`: `production`

6. **Click "Deploy"**

---

### Step 3: Verify Deployment

Once deployed, Vercel will provide you with a URL like:
```
https://taskmaster-pro.vercel.app
```

**Test the following:**

1. **Health Check**
   ```
   https://your-app.vercel.app/api/health
   ```
   Should return:
   ```json
   {
     "success": true,
     "message": "Server is running",
     "time": "2026-06-27T...",
     "environment": "production"
   }
   ```

2. **Frontend**
   ```
   https://your-app.vercel.app
   ```
   Should display the TaskMaster Pro interface

3. **Create a Task**
   - Click "Create New Task"
   - Fill in details
   - Submit
   - Task should appear in the list

4. **Test Filters**
   - Use sidebar filters
   - Search functionality
   - Pagination

---

## 🔧 Post-Deployment Configuration

### Custom Domain (Optional)

1. **In Vercel Dashboard:**
   - Go to your project
   - Click "Settings" → "Domains"
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update DNS Records**
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Or A record to Vercel's IP

---

## 🐛 Troubleshooting

### Issue: "Module not found" error

**Solution:**
```bash
# Make sure all dependencies are in package.json
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

### Issue: Database resets on each request

**Expected Behavior**: SQLite on Vercel uses `/tmp` directory which is ephemeral.

**Solutions:**
1. Use this for demos only
2. Migrate to Vercel Postgres (see migration guide below)
3. Use external database service (Turso, Supabase, etc.)

### Issue: CORS errors

**Solution**: Already configured in `server.js`:
```javascript
app.use(cors());
```

If still having issues, update to:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
```

### Issue: Routes not working

**Solution**: Check `vercel.json` configuration is properly set up.

### Issue: Static files not serving

**Solution**: Ensure `public` folder is committed to git:
```bash
git add public/
git commit -m "Add public assets"
git push
```

---

## 🔄 Updating Your Deployment

After making changes:

```bash
# Commit changes
git add .
git commit -m "Your update message"
git push

# Vercel will auto-deploy from main branch
# Or manually deploy:
vercel --prod
```

---

## 📊 Migrating to Vercel Postgres (Production Ready)

For persistent data storage, migrate to Vercel Postgres:

### Step 1: Create Postgres Database

1. In Vercel Dashboard:
   - Go to Storage tab
   - Click "Create Database"
   - Select "Postgres"
   - Choose region close to your users
   - Click "Create"

### Step 2: Install Postgres Client

```bash
npm install @vercel/postgres
```

### Step 3: Update Database Configuration

Create `db/postgres.js`:
```javascript
const { sql } = require('@vercel/postgres');

async function initDatabase() {
  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      priority TEXT NOT NULL DEFAULT 'medium',
      due_date TEXT,
      category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;

  // Insert default categories
  await sql`
    INSERT INTO categories (name) VALUES 
    ('Work'), ('Personal'), ('Fitness'), ('Shopping'), ('Study')
    ON CONFLICT (name) DO NOTHING;
  `;
}

module.exports = { sql, initDatabase };
```

### Step 4: Update Routes

Replace database calls in routes with Postgres queries.

### Step 5: Add Environment Variables

Vercel automatically provides `POSTGRES_URL` and other connection variables.

### Step 6: Deploy

```bash
vercel --prod
```

---

## 📈 Monitoring & Analytics

### View Logs

**Vercel Dashboard:**
- Go to your project
- Click "Deployments"
- Select a deployment
- View "Functions" logs

**CLI:**
```bash
vercel logs
```

### Monitor Performance

1. **Vercel Analytics** (Free)
   - Go to project settings
   - Enable Web Analytics
   - View real-time visitor data

2. **Speed Insights**
   - Enable in project settings
   - Monitor Core Web Vitals

---

## 🔒 Security Best Practices

### 1. Environment Variables

Store sensitive data in Vercel environment variables:
- Database credentials
- API keys
- Secret tokens

**Add via Dashboard:**
Settings → Environment Variables

**Add via CLI:**
```bash
vercel env add DATABASE_URL
```

### 2. Rate Limiting

Consider adding rate limiting for API routes:
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 3. Input Validation

Already implemented with:
- SQL parameter binding (prevents SQL injection)
- HTML escaping (prevents XSS)
- Input trimming and validation

---

## 💡 Tips for Success

1. **Test Locally First**
   ```bash
   npm start
   # Test at http://localhost:3000
   ```

2. **Use Preview Deployments**
   - Every push to a branch creates a preview URL
   - Test before merging to main

3. **Monitor Cold Starts**
   - First request after inactivity may be slow
   - Keep functions warm with scheduled pings if needed

4. **Optimize Bundle Size**
   - Already optimized (no frontend framework)
   - Vanilla JS keeps it fast

5. **Set Up CI/CD**
   - Automatic deployments on push
   - Run tests before deployment (add test script)

---

## 📞 Support Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Vercel Community**: https://github.com/vercel/vercel/discussions
- **Project Issues**: Create issue in your repository

---

## ✅ Deployment Checklist

Use this checklist before deploying:

- [ ] All code committed to git
- [ ] Repository pushed to GitHub/GitLab/Bitbucket
- [ ] Dependencies listed in package.json
- [ ] Environment variables configured (if any)
- [ ] Database initialization working
- [ ] API endpoints tested locally
- [ ] Frontend responsive on all devices
- [ ] No console errors in browser
- [ ] vercel.json configured correctly
- [ ] .gitignore excludes sensitive files
- [ ] README.md updated with live URL
- [ ] Custom domain configured (optional)

---

## 🎉 Your App is Live!

Congratulations! Your TaskMaster Pro application is now live on the internet.

**Share your deployment:**
```
🚀 TaskMaster Pro
Live Demo: https://your-app.vercel.app
GitHub: https://github.com/your-username/taskmaster-pro
```

**Next Steps:**
1. Share the URL with users
2. Monitor performance and errors
3. Collect feedback
4. Iterate and improve
5. Consider migration to persistent database for production

---

## 📄 Additional Resources

### Vercel Serverless Functions
- [Documentation](https://vercel.com/docs/concepts/functions/serverless-functions)
- Automatic scaling
- Pay-as-you-go pricing
- Free tier: 100GB-hours/month

### Vercel Storage Options
- **Vercel Postgres**: Managed PostgreSQL
- **Vercel KV**: Redis-compatible key-value store
- **Vercel Blob**: Object storage for files

### Performance Optimization
- Enable Edge Functions for lower latency
- Use ISR (Incremental Static Regeneration) for pages
- Implement caching strategies

---

**Need Help?**

Open an issue in your repository or contact Vercel support if you encounter any problems during deployment.

Good luck! 🚀
