# NASA Urban Air Quality Simulator - Netlify Deployment Script

Write-Host "🚀 NASA Urban Air Quality Simulator - Netlify Deployment" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "📁 Initializing Git repository..." -ForegroundColor Yellow
    git init
    git branch -M main
} else {
    Write-Host "✅ Git repository already initialized" -ForegroundColor Green
}

# Check if .gitignore exists
if (Test-Path .gitignore) {
    Write-Host "✅ .gitignore file found" -ForegroundColor Green
} else {
    Write-Host "⚠️  Warning: .gitignore not found!" -ForegroundColor Red
}

# Check if environment variables are set
if (Test-Path .env.local) {
    Write-Host "✅ Environment variables file found" -ForegroundColor Green
    Write-Host "⚠️  Remember: .env.local should NOT be committed!" -ForegroundColor Yellow
} else {
    Write-Host "❌ Warning: .env.local not found!" -ForegroundColor Red
}

# Test build locally
Write-Host ""
Write-Host "🔨 Testing production build locally..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed! Fix errors before deploying." -ForegroundColor Red
    exit 1
}

# Commit changes
Write-Host ""
Write-Host "📝 Committing changes..." -ForegroundColor Yellow
git add .
git commit -m "Ready for Netlify deployment - Production build"

Write-Host ""
Write-Host "✅ Pre-deployment checks complete!" -ForegroundColor Green
Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "📋 Next Steps for Netlify Deployment:" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Push to GitHub:" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/ayush3739/Urban-Planner.git" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Go to Netlify:" -ForegroundColor White
Write-Host "   https://app.netlify.com" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Click 'Add new site' → 'Import an existing project'" -ForegroundColor White
Write-Host ""
Write-Host "4. Connect GitHub and select your repository" -ForegroundColor White
Write-Host ""
Write-Host "5. Build settings:" -ForegroundColor White
Write-Host "   - Build command: npm run build" -ForegroundColor Gray
Write-Host "   - Publish directory: .next" -ForegroundColor Gray
Write-Host ""
Write-Host "6. Add environment variables (from .env.local):" -ForegroundColor White
Write-Host "   - NASA_FIRMS_API_KEY" -ForegroundColor Gray
Write-Host "   - NEXT_PUBLIC_NASA_FIRMS_API_KEY" -ForegroundColor Gray
Write-Host "   - NEXT_PUBLIC_OPENAQ_API_KEY" -ForegroundColor Gray
Write-Host "   - NEXT_PUBLIC_GOOGLE_MAPS_API_KEY" -ForegroundColor Gray
Write-Host "   - NEXT_PUBLIC_NASA_EARTHDATA_TOKEN" -ForegroundColor Gray
Write-Host ""
Write-Host "7. Click 'Deploy site' and wait 2-3 minutes!" -ForegroundColor White
Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "📚 Documentation created:" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "✅ README.md - Project overview and features" -ForegroundColor Green
Write-Host "✅ NETLIFY_DEPLOYMENT.md - Complete deployment guide" -ForegroundColor Green
Write-Host "✅ API_DOCUMENTATION.md - API endpoints and usage" -ForegroundColor Green
Write-Host "✅ PROJECT_DATA.md - Data sources and statistics" -ForegroundColor Green
Write-Host "✅ netlify.toml - Netlify configuration" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 Your project is ready for deployment!" -ForegroundColor Green
Write-Host ""
