# Quick Start Guide

Get your Sales Data Management Hub running in 5 minutes!

## Prerequisites Check

```bash
# Check PostgreSQL
psql --version

# Check Python
python3 --version

# Check pip
pip3 --version
```

## Installation Steps

### 1. Install Dependencies (1 minute)
```bash
pip install -r requirements.txt
```

### 2. Initialize Database (1 minute)
```bash
cd database
chmod +x init_database.sh
./init_database.sh
```

**Expected Output:**
```
✓ PostgreSQL found
✓ Database and user created successfully
✓ Schema created successfully
✓ Views and procedures created successfully
Database initialization completed!
```

### 3. Migrate Data (2 minutes)
```bash
cd ../backend
python3 migrate_data.py
```

**Expected Output:**
```
✓ Excel file loaded successfully
✓ Connected to sales_data_hub
✓ Migrated 10 salespeople
✓ Migrated 1100+ customers
✓ Migrated 10 products
✓ Migrated 1100+ customer targets
✓ Migrated 10 salesperson targets
✓ Migrated 350+ invoices
✓ Migrated 15+ agreements
✓ Migrated 8 deals
✓ Created 350+ collection records
Migration completed successfully!
```

### 4. Start API Server (30 seconds)
```bash
python3 app.py
```

**Expected Output:**
```
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 5. Test It!

Open your browser and visit:
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health
- **Dashboard Metrics**: http://localhost:8000/api/dashboard/metrics

Or use curl:
```bash
# Health check
curl http://localhost:8000/health

# Dashboard metrics
curl http://localhost:8000/api/dashboard/metrics | json_pp

# List customers
curl http://localhost:8000/api/customers | json_pp

# Customer achievements
curl "http://localhost:8000/api/analytics/customer-achievements?fiscal_year=2025" | json_pp
```

## Common Issues

### PostgreSQL not found
```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Install PostgreSQL (Mac)
brew install postgresql
```

### Permission denied on init_database.sh
```bash
chmod +x database/init_database.sh
```

### Excel file not found
Make sure `Neelam's Data Sheet (2).xlsx` is in the root directory:
```bash
ls -la "Neelam's Data Sheet (2).xlsx"
```

### Database connection error
Check if PostgreSQL is running:
```bash
sudo systemctl status postgresql

# Or start it
sudo systemctl start postgresql
```

## What's Next?

1. **Explore the API**: Visit http://localhost:8000/docs
2. **Query the database**: `psql -U sales_admin -d sales_data_hub`
3. **View sample queries**: Check README.md for SQL examples
4. **Build a frontend**: Connect to the API endpoints

## Key API Endpoints

- `GET /api/dashboard/metrics` - Dashboard KPIs
- `GET /api/customers` - List all customers
- `GET /api/salespeople` - List all salespeople
- `GET /api/invoices` - List all invoices
- `GET /api/analytics/customer-achievements` - Customer performance
- `GET /api/analytics/salesperson-achievements` - Salesperson performance
- `GET /api/analytics/collections` - Collections summary

## Sample Test

```bash
# Get all active customers
curl "http://localhost:8000/api/customers?status=Active"

# Get Q2 2025 invoices
curl "http://localhost:8000/api/invoices?quarter=Q2&fiscal_year=2025"

# Get top performing salespeople
curl "http://localhost:8000/api/analytics/salesperson-achievements?fiscal_year=2025"
```

## Need Help?

Check the full README.md for:
- Complete API documentation
- Database schema details
- Sample SQL queries
- Troubleshooting guide
