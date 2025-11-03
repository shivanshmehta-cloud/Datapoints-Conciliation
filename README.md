# Sales Data Management Hub

A comprehensive, dynamic data management system that replaces Excel-based sales operations with a robust PostgreSQL database and REST API. This system maintains all the business logic from the original Excel file while providing better scalability, data integrity, and real-time analytics.

## 🎯 Features

### Core Functionality
- **Complete Data Model**: Salespeople, Customers, Products, Invoices, Collections, Agreements, and Deals
- **Hierarchical Structure**: Top-down from Account → Salesperson → Invoice level
- **Business Logic**: Automatic calculations for targets, achievements, gaps, and percentages
- **Quarterly Tracking**: Q1-Q4 breakdown with YTD rollups for both Net New and Retention
- **Hunter/Farmer Model**: Separate tracking for new business vs. retention
- **Collections Management**: Payment tracking with efficiency metrics
- **Real-time Views**: Pre-computed views for dashboard metrics and analytics

### Key Capabilities
- ✅ All formulas and calculations from Excel replicated in SQL
- ✅ Automatic quarterly target splits
- ✅ Achievement tracking with gap analysis
- ✅ GST and total amount auto-calculation
- ✅ Collections efficiency monitoring
- ✅ Tenure calculation for salespeople
- ✅ Revenue categorization (Net New vs Retention)
- ✅ Fiscal year support with Q1 starting in April
- ✅ RESTful API for all CRUD operations
- ✅ Pre-built analytics views

## 📊 System Architecture

```
┌─────────────────┐
│  Excel File     │
│  (Source Data)  │
└────────┬────────┘
         │
         │ migrate_data.py
         ▼
┌─────────────────┐
│  PostgreSQL     │◄──────┐
│  Database       │       │
│  - Tables       │       │
│  - Views        │       │
│  - Procedures   │       │
└────────┬────────┘       │
         │                │
         │                │
         ▼                │
┌─────────────────┐       │
│  FastAPI        │       │
│  Backend API    │───────┘
│  (Port 8000)    │
└────────┬────────┘
         │
         │ REST API
         ▼
┌─────────────────┐
│  Frontend       │
│  (Your Choice)  │
└─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- PostgreSQL 12+ installed and running
- Python 3.8+ installed
- Excel file: `Neelam's Data Sheet (2).xlsx`

### Installation

1. **Clone or navigate to the repository**
```bash
cd Datapoints-Conciliation
```

2. **Install Python dependencies**
```bash
pip install -r requirements.txt
```

3. **Configure environment** (optional)
```bash
cp .env.example .env
# Edit .env if you need custom database credentials
```

4. **Initialize the database**
```bash
cd database
chmod +x init_database.sh
./init_database.sh
```

This will:
- Create the database and user
- Create all tables with indexes and triggers
- Create views and stored procedures

5. **Migrate data from Excel**
```bash
cd ../backend
python3 migrate_data.py
```

This will populate the database with all data from the Excel file.

6. **Start the API server**
```bash
python3 app.py
```

The API will be available at `http://localhost:8000`

### Verify Installation

1. Check API health:
```bash
curl http://localhost:8000/health
```

2. View API documentation:
Open `http://localhost:8000/docs` in your browser

## 📁 Project Structure

```
Datapoints-Conciliation/
├── database/
│   ├── schema.sql                    # Database tables, indexes, triggers
│   ├── views_and_procedures.sql      # Business logic views and procedures
│   └── init_database.sh              # Database initialization script
├── backend/
│   ├── app.py                        # FastAPI application
│   └── migrate_data.py               # Excel to PostgreSQL migration
├── Neelam's Data Sheet (2).xlsx      # Source Excel file
├── requirements.txt                  # Python dependencies
├── .env.example                      # Environment configuration template
└── README.md                         # This file
```

## 🗄️ Database Schema

### Core Tables

#### `salespeople`
- Salesperson master data
- Tracks role (Hunter/Farmer/Both), tenure, contact info

#### `customers`
- Customer master data
- Links to hunter_id and farmer_id for proper revenue attribution

#### `products`
- Product catalog with categories and pricing

#### `invoices`
- All invoice transactions
- Auto-calculates GST, totals, quarter, fiscal year
- Links to customer and salesperson (owner)

#### `collections`
- Payment tracking for each invoice
- Auto-calculates outstanding, efficiency, days overdue

#### `agreements`
- Customer contracts with renewal tracking

#### `deals`
- Sales pipeline from HubSpot
- Quarterly revenue projections

#### `customer_targets`
- Annual and quarterly targets by customer
- Separate Net New and Retention targets

#### `salesperson_targets`
- Annual and quarterly targets by salesperson
- Separate Net New and Retention targets

### Key Views

#### `vw_customer_quarterly_achievements`
Complete achievement tracking for each customer:
- All quarterly targets and actuals
- Net New vs Retention breakdown
- Gap analysis and achievement percentages
- YTD rollups

#### `vw_salesperson_quarterly_achievements`
Complete achievement tracking for each salesperson:
- All quarterly targets and actuals
- Net New vs Retention breakdown
- Gap analysis and achievement percentages
- YTD rollups

#### `vw_dashboard_metrics`
Executive dashboard KPIs:
- Total counts (customers, salespeople, products, deals)
- Team performance (Q2 focus)
- Collection metrics
- Revenue breakdown
- Pipeline value

#### `vw_collections_summary`
Collections with full context:
- Invoice and payment details
- Customer and salesperson info
- Days outstanding and efficiency

## 🔌 API Endpoints

### Health & Info
- `GET /` - API health check
- `GET /health` - Database connectivity check
- `GET /docs` - Interactive API documentation

### Salespeople
- `GET /api/salespeople` - List all salespeople
- `GET /api/salespeople/{id}` - Get salesperson by ID
- `POST /api/salespeople` - Create salesperson
- `PUT /api/salespeople/{id}` - Update salesperson

### Customers
- `GET /api/customers` - List all customers (filter by status, type)
- `GET /api/customers/{id}` - Get customer by ID
- `POST /api/customers` - Create customer
- `PUT /api/customers/{id}` - Update customer

### Invoices
- `GET /api/invoices` - List invoices (filter by customer, quarter, year, category)
- `POST /api/invoices` - Create invoice

### Dashboard & Analytics
- `GET /api/dashboard/metrics` - Get dashboard KPIs
- `GET /api/analytics/customer-achievements` - Customer achievement report
- `GET /api/analytics/salesperson-achievements` - Salesperson achievement report
- `GET /api/analytics/collections` - Collections summary

### Targets
- `POST /api/targets/customer` - Set customer targets
- `POST /api/targets/salesperson` - Set salesperson targets

## 💡 Usage Examples

### Query Dashboard Metrics
```bash
curl http://localhost:8000/api/dashboard/metrics
```

### Get Customer Achievements for FY 2025
```bash
curl "http://localhost:8000/api/analytics/customer-achievements?fiscal_year=2025"
```

### Get Salesperson Performance
```bash
curl "http://localhost:8000/api/analytics/salesperson-achievements?salesperson_id=753"
```

### Create New Invoice
```bash
curl -X POST http://localhost:8000/api/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "invoice_id": "INV-2025-001",
    "customer_id": "C001",
    "invoice_date": "2025-04-15",
    "revenue_category": "Net New",
    "quarter": "Q1",
    "amount": 100000,
    "owner_id": "753"
  }'
```

### Set Customer Targets
```bash
curl -X POST http://localhost:8000/api/targets/customer \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "C001",
    "fiscal_year": 2025,
    "annual_netnew_target": 5000000,
    "annual_retention_target": 3000000
  }'
```

## 🔧 Business Logic

### Quarterly Calculation
- Fiscal year starts in April (Q1: Apr-Jun, Q2: Jul-Sep, Q3: Oct-Dec, Q4: Jan-Mar)
- Quarters auto-determined from invoice dates
- Annual targets auto-split into quarterly targets (unless manually set)

### Achievement Tracking
- **Net New**: Revenue from new logos or expansion
- **Retention**: Recurring revenue from existing customers
- **Gap**: Achievement - Target
- **Achievement %**: Achievement / Target * 100

### Hunter/Farmer Model
- **Hunter**: Salesperson responsible for Net New revenue
- **Farmer**: Salesperson responsible for Retention revenue
- Each customer assigned both a hunter_id and farmer_id
- Invoices auto-routed to correct owner based on revenue_category

### Auto-Calculations
1. **Invoices**:
   - GST = Amount * 0.18 (if not provided)
   - Total = Amount + GST
   - Hunting/Farming derived from revenue_category
   - Fiscal year extracted from invoice_date

2. **Collections**:
   - Balance Outstanding = Invoice Amount - Amount Collected
   - Days Outstanding = Today - Invoice Date (if not paid)
   - Collection Efficiency = Amount Collected / Invoice Amount
   - Status auto-updated (Pending → Overdue → Paid)

3. **Tenure**:
   - Calculated as months since joining_date
   - Status: "New Joiner" (<12 months) or "Experienced" (≥12 months)

## 📈 Sample Queries

### Top Performing Salespeople (Q2)
```sql
SELECT name, role, q2_total_ach, q2_ach_pct
FROM vw_salesperson_quarterly_achievements
WHERE fiscal_year = 2025
ORDER BY q2_ach_pct DESC
LIMIT 10;
```

### Customers Below Target
```sql
SELECT client_name, ytd_total_target, ytd_total_ach, ytd_gap, ytd_ach_pct
FROM vw_customer_quarterly_achievements
WHERE fiscal_year = 2025 AND ytd_ach_pct < 0.8
ORDER BY ytd_gap ASC;
```

### Overdue Collections
```sql
SELECT client_name, invoice_id, invoice_amount,
       balance_outstanding, days_outstanding
FROM vw_collections_summary
WHERE payment_status = 'Overdue'
ORDER BY days_outstanding DESC;
```

### Revenue by Quarter
```sql
SELECT quarter,
       SUM(CASE WHEN revenue_category = 'Net New' THEN amount ELSE 0 END) as net_new,
       SUM(CASE WHEN revenue_category = 'Retention' THEN amount ELSE 0 END) as retention,
       SUM(amount) as total
FROM invoices
WHERE fiscal_year = 2025
GROUP BY quarter
ORDER BY quarter;
```

## 🔐 Security Considerations

For production deployment:
1. Change default database password
2. Use environment variables for all credentials
3. Enable SSL for database connections
4. Implement API authentication (JWT tokens)
5. Add rate limiting
6. Configure CORS properly
7. Use a reverse proxy (nginx)
8. Regular database backups

## 🛠️ Maintenance

### Backup Database
```bash
pg_dump -U sales_admin sales_data_hub > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
psql -U sales_admin sales_data_hub < backup_20250101.sql
```

### Refresh from Excel
```bash
cd backend
python3 migrate_data.py
```

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U sales_admin -d sales_data_hub -h localhost -p 5432
```

### API Not Starting
```bash
# Check if port 8000 is available
lsof -i :8000

# Check for Python errors
python3 backend/app.py
```

### Migration Errors
- Ensure Excel file path is correct
- Check database credentials in .env
- Verify all foreign key references exist

## 📞 Support

For issues or questions:
1. Check the API documentation: `http://localhost:8000/docs`
2. Review database schema: `database/schema.sql`
3. Check views and procedures: `database/views_and_procedures.sql`

## 📝 License

This project is proprietary software for internal use.

---

**Version**: 1.0.0
**Last Updated**: 2025
**Database**: PostgreSQL 12+
**API**: FastAPI 0.104+
**Python**: 3.8+
