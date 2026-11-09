# ==============================================================
# One-Click Git & GitHub Auto-Sync Script
# Repository: https://github.com/bhuvankolisetti/e-commerce
# Author: Bhuvan Kolisetti
# ==============================================================

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Amazon Clone - GitHub Auto-Sync Script" -ForegroundColor Yellow
Write-Host "  Target Repo: https://github.com/bhuvankolisetti/e-commerce" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Check if git is installed
$gitCmd = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitCmd) {
    Write-Host "[!] Git is not yet detected in your PATH." -ForegroundColor Red
    Write-Host "[*] Attempting to install Git via Windows Package Manager (winget)..." -ForegroundColor Yellow
    
    try {
        winget install --id Git.Git -e --source winget --accept-source-agreements --accept-package-agreements
        Write-Host "[✓] Git installed successfully! Please restart this terminal." -ForegroundColor Green
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    } catch {
        Write-Host "[!] Please install Git manually from https://git-scm.com/download/win" -ForegroundColor Red
        Pause
        exit 1
    }
}

# 2. Configure Git Identity
Write-Host "[1/5] Configuring Git identity..." -ForegroundColor White
git config user.name "Bhuvan Kolisetti"
git config user.email "bhuvankolisetti@users.noreply.github.com"

# 3. Initialize repository if needed
if (-not (Test-Path ".git")) {
    Write-Host "[2/5] Initializing new local Git repository..." -ForegroundColor White
    git init
    git branch -M main
} else {
    Write-Host "[2/5] Existing Git repository detected." -ForegroundColor Green
}

# 4. Configure Remote
$remoteUrl = "https://github.com/bhuvankolisetti/e-commerce.git"
$existingRemote = git remote get-url origin 2>$null

if (-not $existingRemote) {
    Write-Host "[3/5] Linking remote repository: $remoteUrl" -ForegroundColor White
    git remote add origin $remoteUrl
} else {
    Write-Host "[3/5] Remote already set to: $existingRemote" -ForegroundColor Green
    git remote set-url origin $remoteUrl
}

# 5. Stage & Commit
Write-Host "[4/5] Staging all files..." -ForegroundColor White
git add -A

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$commitMsg = "Amazon Clone Final Year Project update - $timestamp"
git commit -m $commitMsg

# 6. Push to GitHub
Write-Host "[5/5] Pushing changes to GitHub branch 'main'..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host " [✓] SUCCESS! All files updated on GitHub:" -ForegroundColor Green
    Write-Host " https://github.com/bhuvankolisetti/e-commerce" -ForegroundColor Yellow
    Write-Host "==========================================================" -ForegroundColor Green
} else {
    Write-Host "==========================================================" -ForegroundColor Red
    Write-Host " [!] Push requires authentication or branch alignment." -ForegroundColor Red
    Write-Host " If this is your first push with an existing README on GitHub, run:" -ForegroundColor Yellow
    Write-Host "   git pull origin main --rebase" -ForegroundColor Yellow
    Write-Host "   git push -u origin main" -ForegroundColor Yellow
    Write-Host "==========================================================" -ForegroundColor Red
}

Pause

