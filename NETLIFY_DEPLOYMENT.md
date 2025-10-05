# 🚀 Netlify Deployment Guide

Complete step-by-step guide to deploy the NASA Urban Air Quality Simulator on Netlify.

## ⚡ Quick Deploy (5 minutes)

### Option 1: Deploy via GitHub (Recommended)

1. **Prepare Your Repository**
   ```bash
   # Initialize git if not already done
   git init
   
   # Add all files
   git add .
   
   # Commit changes
   git commit -m "Ready for Netlify deployment"
   
   # Create main branch
   git branch -M main
   
   # Add your GitHub repository
   git remote add origin https://github.com/ayush3739/Urban-Planner.git
   
   # Push to GitHub
   git push -u origin main
   ```

2. **Deploy on Netlify**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click **"Add new site"** → **"Import an existing project"**
   - Choose **"Deploy with GitHub"**
   - Authorize Netlify to access your GitHub account
   - Select your repository
   - Configure build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `.next`
     - **Base directory**: (leave empty)
   - Click **"Deploy site"**

3. **Add Environment Variables**
   - Go to **Site settings** → **Environment variables**
   - Click **"Add a variable"**
   - Add each variable from your `.env.local`:

   ```
   NASA_FIRMS_API_KEY = c9a0f9f87703cbd05ac4906f450c3755
   NEXT_PUBLIC_NASA_FIRMS_API_KEY = c9a0f9f87703cbd05ac4906f450c3755
   NEXT_PUBLIC_OPENAQ_API_KEY = 706306e2b140aee16932e5b073e2de6a6e9b30ce1f796441ad953676cd82bded
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = AIzaSyBoq5tXfaxm25brQhm8RUnjJgGEN8bVXNc
   NEXT_PUBLIC_NASA_EARTHDATA_TOKEN = eyJ0eXAiOiJKV1QiLCJvcmlnaW4iOiJFYXJ0aGRhdGEgTG9naW4iLCJzaWciOiJlZGxqd3RwdWJrZXlfb3BzIiwiYWxnIjoiUlMyNTYifQ.eyJ0eXBlIjoiVXNlciIsInVpZCI6ImFzdGhhXzcwMDciLCJleHAiOjE3NjQ3NDQ1MzEsImlhdCI6MTc1OTU2MDUzMSwiaXNzIjoiaHR0cHM6Ly91cnMuZWFydGhkYXRhLm5hc2EuZ292IiwiaWRlbnRpdHlfcHJvdmlkZXIiOiJlZGxfb3BzIiwiYWNyIjoiZWRsIiwiYXNzdXJhbmNlX2xldmVsIjozfQ.UYm_scuyjZR2gD90I1kMJmFzy3wk8Y8cp0HZgifbN86XGox2lBz3rzZcg_i1p9vGLc3G9XX3JcJuXMr47vtzC3-rT3fEXrfCuuDPlOurBhPZj2qDoXaKmZn4k7e4ejjWPvbQMiqe7JE31-2ObqSU_sb7ILI6gbcbdEMBJLvBvsmG38g_vrQdvnVmqQWBrSB27rlLs5Cf5rCCk6TuM_hzwgUsoLdu_lPtSPhPwhSMxC4p77eH11g4pul6lpVwVvOkNhGpCIKxzslMu6uGv-0KwWS03Rb6rafSc-Wl7BsOqMUc7MdcxQViejV39DdxZtpliHe-VOeCzKMSPHYAr3n85Q
   NEXT_PUBLIC_COPERNICUS_USERNAME = mauryaastha33@gmail.com
   NEXT_PUBLIC_COPERNICUS_PASSWORD = Copernicus@123
   NEXT_PUBLIC_COPERNICUS_CLIENT_ID = cdse-public
   ```

4. **Redeploy**
   - Go to **Deploys** tab
   - Click **"Trigger deploy"** → **"Clear cache and deploy site"**
   - Wait 2-3 minutes for build to complete

5. **Success!** 🎉
   - Your site is now live at `https://your-site-name.netlify.app`
   - You can customize the domain in **Site settings** → **Domain management**

---

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize Netlify**
   ```bash
   netlify init
   ```
   - Choose **"Create & configure a new site"**
   - Select your team
   - Enter a site name (or leave blank for auto-generated)
   - Build command: `npm run build`
   - Directory to deploy: `.next`

4. **Set Environment Variables**
   ```bash
   netlify env:set NASA_FIRMS_API_KEY "c9a0f9f87703cbd05ac4906f450c3755"
   netlify env:set NEXT_PUBLIC_NASA_FIRMS_API_KEY "c9a0f9f87703cbd05ac4906f450c3755"
   netlify env:set NEXT_PUBLIC_OPENAQ_API_KEY "706306e2b140aee16932e5b073e2de6a6e9b30ce1f796441ad953676cd82bded"
   netlify env:set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY "AIzaSyBoq5tXfaxm25brQhm8RUnjJgGEN8bVXNc"
   # Add remaining variables...
   ```

5. **Deploy**
   ```bash
   netlify deploy --prod
   ```

---

## 📋 Build Configuration

The project includes a `netlify.toml` file with optimal settings:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "18"
```

---

## 🔧 Required Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `NASA_FIRMS_API_KEY` | Server-side NASA FIRMS API access | Yes |
| `NEXT_PUBLIC_NASA_FIRMS_API_KEY` | Client-side reference | Yes |
| `NEXT_PUBLIC_OPENAQ_API_KEY` | OpenAQ air quality data | Yes |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps & Geocoding | Yes |
| `NEXT_PUBLIC_NASA_EARTHDATA_TOKEN` | NASA Earthdata access | Optional |
| `NEXT_PUBLIC_COPERNICUS_USERNAME` | Copernicus data access | Optional |
| `NEXT_PUBLIC_COPERNICUS_PASSWORD` | Copernicus authentication | Optional |
| `NEXT_PUBLIC_COPERNICUS_CLIENT_ID` | Copernicus client ID | Optional |

---

## ⚙️ Netlify-Specific Configuration

### Next.js Plugin
Install the official Next.js plugin for Netlify:
```bash
npm install -D @netlify/plugin-nextjs
```

This plugin is already configured in `netlify.toml` and provides:
- Automatic Next.js detection
- Optimized caching
- Edge function support
- Image optimization

### Build Performance
- **Node Version**: 18 (specified in netlify.toml)
- **Build Time**: ~2-3 minutes
- **Bundle Size**: Optimized by Next.js
- **Memory**: Default (sufficient for this project)

---

## 🌍 Custom Domain (Optional)

### Option 1: Netlify Subdomain
Your site automatically gets a subdomain: `your-site-name.netlify.app`

To customize it:
1. Go to **Site settings** → **Domain management**
2. Click **"Options"** → **"Edit site name"**
3. Enter your desired name (e.g., `nasa-air-quality.netlify.app`)

### Option 2: Custom Domain
1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `yourdomain.com`)
4. Follow DNS configuration instructions
5. Netlify will automatically provision SSL certificate

---

## 🔒 Security Headers

The `netlify.toml` includes security headers:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

---

## 📊 Monitoring & Analytics

### Netlify Analytics (Paid)
- Real-time visitor tracking
- Bandwidth usage
- Page views and unique visitors

### Free Alternatives
- Google Analytics (add to `layout.tsx`)
- Vercel Analytics (if migrating)
- Plausible Analytics

---

## 🔄 Continuous Deployment

Once connected to GitHub:
- **Automatic deploys** on every push to `main`
- **Deploy previews** for pull requests
- **Branch deploys** for testing

### Disable Auto-Deploy (Optional)
1. Go to **Site settings** → **Build & deploy**
2. Under **Continuous deployment**, click **"Edit settings"**
3. Disable **"Automatic deploys"**

---

## 🐛 Troubleshooting

### Build Fails
1. Check **Deploy log** in Netlify dashboard
2. Verify all environment variables are set
3. Ensure `package.json` has correct dependencies
4. Test build locally: `npm run build`

### Environment Variables Not Working
1. Redeploy after adding variables
2. Check variable names (case-sensitive)
3. Ensure `NEXT_PUBLIC_` prefix for client-side variables

### 404 Errors
1. Verify `publish` directory is `.next`
2. Check `netlify.toml` redirects configuration
3. Ensure Next.js plugin is installed

### Slow Build Times
1. Enable **Netlify Build Cache** in settings
2. Use `npm ci` instead of `npm install`
3. Optimize dependencies in `package.json`

### API Routes Not Working
1. Ensure Next.js plugin is installed
2. Check API routes are in `app/api/` directory
3. Verify serverless functions are enabled

---

## 📈 Performance Optimization

### Caching
- Static assets: 1 year cache
- API responses: 1 hour cache
- Next.js pages: Automatic ISR

### Image Optimization
Next.js Image component automatically optimizes images on Netlify.

### Edge Functions
For global users, consider enabling Netlify Edge Functions for faster API responses.

---

## 💰 Pricing

### Netlify Free Tier Includes:
- ✅ 100GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Unlimited sites
- ✅ SSL certificates
- ✅ Deploy previews
- ✅ Serverless functions

This project fits comfortably within the free tier for moderate traffic.

---

## 🔐 Environment Security

**Important**: Never commit `.env.local` to GitHub!

The `.gitignore` already includes:
```
.env*.local
.env.local
```

---

## 📱 Testing Production Build

Before deploying, test the production build locally:

```bash
# Build the project
npm run build

# Start production server
npm start

# Test at http://localhost:3000
```

---

## ✅ Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] Environment variables documented
- [ ] `.gitignore` includes `.env.local`
- [ ] `netlify.toml` configured
- [ ] Build successful locally (`npm run build`)
- [ ] No console errors in production mode
- [ ] API keys valid and active
- [ ] README.md updated
- [ ] Repository pushed to GitHub

---

## 🎯 Post-Deployment Steps

1. **Test Live Site**
   - Visit all pages
   - Check API endpoints
   - Verify data loading
   - Test on mobile devices

2. **Monitor Logs**
   - Check Netlify function logs
   - Monitor error rates
   - Track performance metrics

3. **Set Up Monitoring**
   - Add status page monitoring
   - Configure uptime alerts
   - Track API usage

4. **Share Your Site**
   - Update README with live URL
   - Share on social media
   - Get user feedback

---

## 🆘 Support Resources

- **Netlify Docs**: https://docs.netlify.com
- **Next.js on Netlify**: https://docs.netlify.com/frameworks/next-js/
- **Netlify Support**: https://answers.netlify.com
- **Project Issues**: Open issue on GitHub

---

## 🎉 Success!

Your NASA Urban Air Quality Simulator is now live on Netlify!

**Live URL**: `https://your-site-name.netlify.app`

---

**Deployment Time**: ~5 minutes  
**Build Time**: ~2-3 minutes  
**Total Setup**: ~10 minutes  

🚀 **Happy Deploying!**
