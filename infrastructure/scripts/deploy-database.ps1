# ============================================
# FitIt Database - Deployment Script
# ============================================
# Deploys only the database stack (DynamoDB tables)
# Use this to add new tables without affecting other stacks
# ============================================

param(
    [string]$Region = "us-east-2"
)

$ErrorActionPreference = "Stop"
$InfraRoot = $PSScriptRoot
$InfraParent = Split-Path $InfraRoot -Parent

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  FitIt Database Stack Deployment" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Verify AWS credentials
Write-Host "[1/3] Verifying AWS credentials..." -ForegroundColor Yellow
$AccountId = aws sts get-caller-identity --query Account --output text
if ($LASTEXITCODE -ne 0) { 
    throw "Failed to get AWS Account ID. Run 'aws configure' to set up credentials." 
}
Write-Host "  Account: $AccountId, Region: $Region" -ForegroundColor Gray

# Build TypeScript
Write-Host "[2/3] Building infrastructure..." -ForegroundColor Yellow
Push-Location $InfraParent
try {
    npm run build
    if ($LASTEXITCODE -ne 0) { throw "Build failed" }
}
finally {
    Pop-Location
}
Write-Host "  Build complete" -ForegroundColor Green

# Deploy database stack only
Write-Host "[3/3] Deploying FititDatabaseStack..." -ForegroundColor Yellow
Push-Location $InfraParent
try {
    npx cdk deploy FititDatabaseStack --require-approval never
    if ($LASTEXITCODE -ne 0) { throw "CDK deploy failed" }
}
finally {
    Pop-Location
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  DATABASE STACK DEPLOYED!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host "`nTables created/updated:" -ForegroundColor Cyan
Write-Host "  - fitit-products" -ForegroundColor White
Write-Host "  - fitit-service-profiles" -ForegroundColor White
Write-Host "  - fitit-service-requests" -ForegroundColor White
Write-Host "  - fitit-chat" -ForegroundColor White
Write-Host "  - fitit-users (NEW)" -ForegroundColor Green
Write-Host "  - fitit-counters (NEW)" -ForegroundColor Green
