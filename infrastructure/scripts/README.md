# ============================================

# FitIt Infrastructure Deployment Scripts

# ============================================

## Scripts

### deploy-frontend.ps1

Deploys the frontend application to AWS ECS/Fargate.

**Usage:**

```powershell
cd infrastructure
.\scripts\deploy-frontend.ps1
```

**What it does:**

1. Loads environment variables from `.env.production`
2. Builds the frontend with Vite
3. Creates a Docker image (linux/amd64)
4. Pushes to ECR
5. Updates ECS service

### deploy-database.ps1

Deploys only the database stack (DynamoDB tables).

**Usage:**

```powershell
cd infrastructure
.\scripts\deploy-database.ps1
```

---

## Prerequisites

1. **AWS CLI** configured with valid credentials
2. **Docker Desktop** running with buildx support
3. **Node.js** installed for frontend build
4. **Environment file**: Copy `.env.production` and fill in real values

---

## Full Infrastructure Deployment

To deploy all stacks:

```powershell
cd infrastructure
npx cdk deploy --all
```

To deploy specific stacks:

```powershell
npx cdk deploy FititDatabaseStack     # DynamoDB tables only
npx cdk deploy FititBackendStack      # Backend Lambda + API Gateway
npx cdk deploy FititFrontendStack     # ECS/Fargate + ALB
```

---

## Security Notes

- **Never commit** `.env.production` or `.env.local` files
- All secrets should be in environment files (gitignored)
- Supabase anon keys are safe for frontend (Row Level Security)
- AWS credentials should use IAM roles in production
