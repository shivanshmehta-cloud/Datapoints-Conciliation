# Deployment Guide

This guide explains how to deploy the Sales Data Management Hub demo to various platforms so you can access it from your browser.

## Option 1: GitHub Pages (Easiest - Static Demo)

GitHub Pages allows you to host the static HTML demo directly from your repository.

### Steps:

1. **The `index.html` file is already in your repository**

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub: https://github.com/shivanshmehta-cloud/Datapoints-Conciliation
   - Click on "Settings"
   - Scroll down to "Pages" in the left sidebar
   - Under "Source", select branch: `claude/read-excel-file-011CUf9BytNUnUhNWowrVyF9`
   - Select folder: `/ (root)`
   - Click "Save"

3. **Access your demo:**
   - After a few minutes, your site will be available at:
   - `https://shivanshmehta-cloud.github.io/Datapoints-Conciliation/`

### What You'll Get:
- ✅ Interactive web interface
- ✅ Complete documentation
- ✅ Database schema overview
- ✅ API endpoint documentation
- ✅ Setup instructions
- ✅ SQL query examples
- ✅ No installation required to view

## Option 2: Railway (Full API with Database)

Railway provides free hosting for the full Python API with PostgreSQL database.

### Steps:

1. **Sign up at Railway.app**
   - Visit: https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your repository

3. **Add PostgreSQL**
   - Click "New"
   - Select "Database" → "PostgreSQL"

4. **Configure Environment Variables**
   ```
   DB_HOST=(Railway will provide)
   DB_PORT=5432
   DB_NAME=railway
   DB_USER=postgres
   DB_PASSWORD=(Railway will provide)
   ```

5. **Deploy**
   - Railway will automatically deploy your app
   - You'll get a public URL like: `https://your-app.railway.app`

### Cost:
- Free tier: $5 worth of usage per month
- More than enough for development/demo

## Option 3: Render (Full API with Database)

Render offers free hosting for web services.

### Steps:

1. **Sign up at Render.com**
   - Visit: https://render.com
   - Sign up with GitHub

2. **Create PostgreSQL Database**
   - Click "New" → "PostgreSQL"
   - Choose free tier
   - Note the connection details

3. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Build Command: `pip install -r requirements.txt && cd database && ./init_database.sh`
   - Start Command: `cd backend && python3 app.py`

4. **Set Environment Variables**
   - Add the PostgreSQL connection details

5. **Deploy**
   - Render will build and deploy your app
   - You'll get a public URL

### Cost:
- Free tier available
- Auto-suspends after inactivity

## Option 4: Fly.io (Full API with Database)

Fly.io provides excellent free tier for full-stack apps.

### Steps:

1. **Install flyctl**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Sign up and login**
   ```bash
   flyctl auth signup
   flyctl auth login
   ```

3. **Initialize app**
   ```bash
   cd /path/to/Datapoints-Conciliation
   flyctl launch
   ```

4. **Add PostgreSQL**
   ```bash
   flyctl postgres create
   flyctl postgres attach my-pg-db
   ```

5. **Deploy**
   ```bash
   flyctl deploy
   ```

### Cost:
- Free tier: 3 shared VMs
- Sufficient for development

## Option 5: Vercel (Static Site Only)

For the static HTML demo only.

### Steps:

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd /path/to/Datapoints-Conciliation
   vercel
   ```

3. **Follow prompts**
   - Link to your GitHub account
   - Deploy

4. **Access**
   - You'll get a URL like: `https://your-project.vercel.app`

### Cost:
- Free for personal projects

## Option 6: Replit (Full Stack with One Click)

Replit allows you to run the full Python server with database.

### Steps:

1. **Go to Replit.com**
   - Sign up with GitHub

2. **Import from GitHub**
   - Click "Create Repl"
   - Choose "Import from GitHub"
   - Paste your repo URL

3. **Set up PostgreSQL**
   - In Replit, click "Secrets" (lock icon)
   - Add your database credentials

4. **Run**
   - Click "Run" button
   - Replit will start your app

5. **Make Public**
   - Click the "Share" button
   - Your app will be accessible via a public URL

### Cost:
- Free tier available with always-on option

## Recommended Approach

**For Quick Demo (5 minutes):**
→ Use GitHub Pages (Option 1)
- Just enable Pages in settings
- Access the static HTML demo
- No code execution needed

**For Full Functionality:**
→ Use Railway (Option 2)
- Easy setup with GitHub
- Free PostgreSQL included
- Full API functionality

## What Each Option Provides

| Option | Static Demo | Full API | Database | Cost |
|--------|-------------|----------|----------|------|
| GitHub Pages | ✅ | ❌ | ❌ | Free |
| Railway | ✅ | ✅ | ✅ | Free tier |
| Render | ✅ | ✅ | ✅ | Free tier |
| Fly.io | ✅ | ✅ | ✅ | Free tier |
| Vercel | ✅ | ❌ | ❌ | Free |
| Replit | ✅ | ✅ | ✅ | Free tier |

## Next Steps After Deployment

Once deployed, you can:

1. **View the documentation** - Complete system overview
2. **See database schema** - All 9 tables and relationships
3. **Browse API endpoints** - 20+ endpoints documented
4. **Check setup instructions** - Step-by-step deployment guide
5. **View usage examples** - SQL queries and API calls

## Troubleshooting

### GitHub Pages not showing
- Wait 2-5 minutes after enabling
- Check the Pages section shows "Your site is published at..."
- Try accessing with and without trailing slash

### Railway build failing
- Check build logs in Railway dashboard
- Ensure init_database.sh has execute permissions
- Verify PostgreSQL is attached to the web service

### Render deployment issues
- Check the Build & Deploy logs
- Ensure start command is correct
- Verify environment variables are set

## Support

If you encounter issues:
1. Check the deployment platform's documentation
2. Review error logs in the platform's dashboard
3. Verify all environment variables are set correctly
4. Ensure database is created and accessible
