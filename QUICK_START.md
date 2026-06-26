# 🚀 Quick Start - Deploy in 5 Minutes

## Prerequisites
- GitHub account
- Vercel account (free) - [Sign up here](https://vercel.com/signup)

---

## Deployment Method 1: One-Click Deploy (Easiest)

### Step 1: Push to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/taskmaster-pro.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your `taskmaster-pro` repository
4. Click "Deploy"
5. Wait 2-3 minutes
6. Done! 🎉

**Your app is live at:** `https://taskmaster-pro-xxxxx.vercel.app`

---

## Deployment Method 2: Using Vercel CLI (Faster)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from project directory)
vercel

# Deploy to production
vercel --prod
```

**Your app is live!** Vercel will show you the URL.

---

## ⚠️ Important: About Data Persistence

**Current Setup (SQLite):**
- ✅ Works immediately
- ✅ No database setup needed
- ⚠️ Data resets on redeploy
- ⚠️ Not suitable for production

**For Production (Persistent Data):**
- Use Vercel Postgres (recommended)
- See `DEPLOYMENT_GUIDE.md` for migration steps

---

## Quick Test After Deployment

1. **Visit your URL**: `https://your-app.vercel.app`
2. **Create a task**: Click "Create New Task"
3. **Test filters**: Use sidebar to filter tasks
4. **Test search**: Search for your task
5. **Test pagination**: Add 6+ tasks to see pagination

---

## Updating Your App

```bash
# Make changes to your code
# Commit and push
git add .
git commit -m "Update description"
git push

# Vercel auto-deploys! No manual steps needed.
```

---

## Custom Domain (Optional)

1. In Vercel Dashboard → Settings → Domains
2. Add your domain: `taskmaster.yourdomain.com`
3. Update DNS records as shown
4. Done in 5 minutes!

---

## Troubleshooting

### Issue: Build fails
- Check `vercel logs` or dashboard logs
- Ensure all files are committed
- Run `npm install` locally to verify dependencies

### Issue: Can't see the app
- Check deployment status in dashboard
- Visit `/api/health` endpoint to verify API
- Clear browser cache and reload

### Issue: Database not working
- Expected for SQLite (ephemeral storage)
- For persistent data, migrate to Vercel Postgres

---

## Next Steps

1. ✅ Deploy successfully
2. 📊 Add Vercel Analytics (Settings → Analytics)
3. 🔐 Set up custom domain
4. 🗄️ Migrate to persistent database
5. 📱 Share with users!

---

**Need detailed instructions?** See `DEPLOYMENT_GUIDE.md`

**Need help?** Open an issue or check [Vercel Docs](https://vercel.com/docs)
