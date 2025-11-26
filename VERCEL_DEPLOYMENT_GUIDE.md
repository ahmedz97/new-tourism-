# 🚀 Vercel Deployment Guide - Tourism Project

## ✅ Configuration Updated!

I've updated your `vercel.json` with optimized settings to prevent common deployment errors.

## 📋 What Was Fixed:

1. **Added `--legacy-peer-deps`** to handle dependency conflicts
2. **Increased Node memory** to 4GB to prevent build crashes
3. **Set Node version** to 18 for compatibility
4. **Updated install command** to handle peer dependency issues

---

## 🌐 Deploy to Vercel (Choose One Method)

### **Method 1: Via Vercel Website (Recommended - Easiest)** ⭐

1. **Go to:** https://vercel.com/new

2. **Sign in with GitHub**

3. **Import Repository:**
   - Click "Import Project"
   - Search for: `ahmedz97/new-tourism-`
   - Click "Import"

4. **Configure Project:**
   - **Framework Preset:** Angular (auto-detected)
   - **Root Directory:** `./`
   - **Build Command:** Auto-detected from vercel.json
   - **Output Directory:** Auto-detected from vercel.json
   
5. **Click "Deploy"**

6. **Wait 5-10 minutes** for the first build

7. **Get your URL:** `https://your-project.vercel.app`

---

### **Method 2: Via Vercel CLI** 💻

```bash
# 1. Login to Vercel (will open browser)
vercel login
# Choose "Continue with GitHub"

# 2. Deploy to production
vercel --prod

# Follow the prompts:
# - Link to existing project? No
# - What's your project's name? new-tourism (or any name)
# - In which directory is your code located? ./
# - Want to override settings? No
```

---

## 🐛 Common Errors & Solutions

### Error 1: "ELIFECYCLE" or npm install failed

**Solution:** Already fixed in vercel.json with `--legacy-peer-deps`

If still occurs:
- Go to Vercel Dashboard → Project Settings → Environment Variables
- Add: `NPM_FLAGS` = `--legacy-peer-deps`

---

### Error 2: "JavaScript heap out of memory"

**Solution:** Already fixed with `NODE_OPTIONS=--max_old_space_size=4096`

If still occurs:
- Increase to 8192: `NODE_OPTIONS=--max_old_space_size=8192`

---

### Error 3: Build exceeds budget

**Solution:** Already fixed in angular.json (increased to 15kb for styles)

Current budgets:
- Initial: 2MB max
- Component Styles: 15KB max

---

### Error 4: "Cannot find module '@angular/..'"

**Solution:**
1. Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
git add package-lock.json
git commit -m "Update package lock"
git push
```

---

### Error 5: Routes not working (404 on refresh)

**Solution:** Already fixed with rewrites in vercel.json
```json
"rewrites": [
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
]
```

---

## 🔧 Environment Variables (If Needed)

If your app uses environment variables:

1. Go to: **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**

2. Add your variables:
   - `API_URL`
   - `API_KEY`
   - etc.

3. Redeploy the project

---

## 📊 After Deployment

### Check Build Logs:
1. Go to Vercel Dashboard
2. Click on your project
3. Click "Deployments"
4. Click on the latest deployment
5. Check "Build Logs" for any errors

### Test Your Site:
- Visit the provided URL
- Test all routes
- Check browser console for errors
- Test on mobile

---

## 🔄 Future Deployments

After initial setup, every `git push` will automatically:
1. Trigger a new deployment
2. Build the project
3. Deploy to production
4. Update your live site (3-5 minutes)

---

## 📞 Need Help?

If you encounter any errors:

1. **Copy the error message** from Vercel build logs
2. **Share it** so I can help fix it
3. **Check** the "Common Errors" section above

---

## 🎯 Your Repository

**GitHub:** https://github.com/ahmedz97/new-tourism-.git
**Vercel Dashboard:** https://vercel.com/dashboard

---

## ✨ Quick Commands Reference

```bash
# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View project logs
vercel logs

# Remove a deployment
vercel rm [deployment-url]
```

---

**Good luck with your deployment! 🚀**

