"""
Sales Data Management Hub - Backend API
FastAPI application for managing sales data with PostgreSQL
"""

from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from datetime import date, datetime
from decimal import Decimal
import psycopg2
from psycopg2.extras import RealDictCursor
from pydantic import BaseModel, Field
import os
from contextlib import contextmanager

# ==========================================
# DATABASE CONNECTION
# ==========================================

DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": os.getenv("DB_PORT", "5432"),
    "database": os.getenv("DB_NAME", "sales_data_hub"),
    "user": os.getenv("DB_USER", "sales_admin"),
    "password": os.getenv("DB_PASSWORD", "sales_secure_pass_2025")
}

@contextmanager
def get_db():
    """Database connection context manager"""
    conn = psycopg2.connect(**DB_CONFIG)
    try:
        yield conn
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()

# ==========================================
# PYDANTIC MODELS
# ==========================================

class SalespersonBase(BaseModel):
    salesperson_id: str
    name: str
    role: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    joining_date: Optional[date] = None
    department: Optional[str] = None
    employment_status: str = "Active"

class CustomerBase(BaseModel):
    customer_id: str
    client_name: str
    industry: Optional[str] = None
    type: Optional[str] = None
    focus_account: bool = False
    cin_number: Optional[str] = None
    status: str = "Active"
    onboarding_date: Optional[date] = None
    hunter_id: Optional[str] = None
    farmer_id: Optional[str] = None

class ProductBase(BaseModel):
    product_id: str
    product_name: str
    category: Optional[str] = None
    base_price: Optional[Decimal] = None
    description: Optional[str] = None
    is_active: bool = True

class InvoiceBase(BaseModel):
    invoice_id: str
    customer_id: str
    invoice_date: date
    usage_month: Optional[date] = None
    account_type: Optional[str] = None
    revenue_type: Optional[str] = None
    product_service: Optional[str] = None
    revenue_category: str  # Net New or Retention
    quarter: str  # Q1, Q2, Q3, Q4
    amount: Decimal
    gst: Optional[Decimal] = None
    billing_status: str = "Unbilled"
    owner_id: Optional[str] = None
    notes: Optional[str] = None
    fiscal_year: Optional[int] = None

class CollectionBase(BaseModel):
    invoice_id: str
    invoice_date: Optional[date] = None
    due_date: Optional[date] = None
    invoice_amount: Decimal
    payment_status: str = "Pending"
    collection_date: Optional[date] = None
    amount_collected: Decimal = Decimal("0")
    notes: Optional[str] = None

class AgreementBase(BaseModel):
    agreement_id: str
    customer_id: str
    agreement_type: Optional[str] = None
    start_date: date
    end_date: date
    contract_value: Optional[Decimal] = None
    payment_terms: Optional[str] = None
    auto_renewal: bool = False
    notice_period_days: Optional[int] = None
    status: str = "Active"
    notes: Optional[str] = None

class DealBase(BaseModel):
    deal_id: str
    deal_name: str
    customer_id: Optional[str] = None
    owner_id: Optional[str] = None
    stage: Optional[str] = None
    amount: Optional[Decimal] = None
    arr: Optional[Decimal] = None
    one_time_amount: Optional[Decimal] = None
    expected_golive_date: Optional[date] = None
    close_date: Optional[date] = None
    q1_revenue: Decimal = Decimal("0")
    q2_revenue: Decimal = Decimal("0")
    q3_revenue: Decimal = Decimal("0")
    q4_revenue: Decimal = Decimal("0")
    fiscal_year: Optional[int] = None

class CustomerTargetBase(BaseModel):
    customer_id: str
    fiscal_year: int
    annual_netnew_target: Decimal = Decimal("0")
    annual_retention_target: Decimal = Decimal("0")
    q1_netnew_target: Optional[Decimal] = None
    q1_retention_target: Optional[Decimal] = None
    q2_netnew_target: Optional[Decimal] = None
    q2_retention_target: Optional[Decimal] = None
    q3_netnew_target: Optional[Decimal] = None
    q3_retention_target: Optional[Decimal] = None
    q4_netnew_target: Optional[Decimal] = None
    q4_retention_target: Optional[Decimal] = None

class SalespersonTargetBase(BaseModel):
    salesperson_id: str
    fiscal_year: int
    annual_netnew_target: Decimal = Decimal("0")
    annual_retention_target: Decimal = Decimal("0")
    q1_netnew_target: Optional[Decimal] = None
    q1_retention_target: Optional[Decimal] = None
    q2_netnew_target: Optional[Decimal] = None
    q2_retention_target: Optional[Decimal] = None
    q3_netnew_target: Optional[Decimal] = None
    q3_retention_target: Optional[Decimal] = None
    q4_netnew_target: Optional[Decimal] = None
    q4_retention_target: Optional[Decimal] = None

# ==========================================
# FASTAPI APP
# ==========================================

app = FastAPI(
    title="Sales Data Management Hub API",
    description="Comprehensive API for managing sales operations data",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/")
def read_root():
    """API health check"""
    return {
        "status": "healthy",
        "service": "Sales Data Management Hub API",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    """Database connectivity check"""
    try:
        with get_db() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT 1")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database unavailable: {str(e)}")

# ==========================================
# SALESPERSON ENDPOINTS
# ==========================================

@app.get("/api/salespeople")
def get_salespeople(status: Optional[str] = None):
    """Get all salespeople"""
    with get_db() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            if status:
                cur.execute("SELECT * FROM salespeople WHERE employment_status = %s", (status,))
            else:
                cur.execute("SELECT * FROM salespeople")
            return cur.fetchall()

@app.get("/api/salespeople/{salesperson_id}")
def get_salesperson(salesperson_id: str):
    """Get salesperson by ID"""
    with get_db() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT * FROM salespeople WHERE salesperson_id = %s", (salesperson_id,))
            result = cur.fetchone()
            if not result:
                raise HTTPException(status_code=404, detail="Salesperson not found")
            return result

@app.post("/api/salespeople")
def create_salesperson(salesperson: SalespersonBase):
    """Create new salesperson"""
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """INSERT INTO salespeople
                (salesperson_id, name, role, email, phone, joining_date, department, employment_status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)""",
                (salesperson.salesperson_id, salesperson.name, salesperson.role,
                 salesperson.email, salesperson.phone, salesperson.joining_date,
                 salesperson.department, salesperson.employment_status)
            )
    return {"message": "Salesperson created successfully", "id": salesperson.salesperson_id}

@app.put("/api/salespeople/{salesperson_id}")
def update_salesperson(salesperson_id: str, salesperson: SalespersonBase):
    """Update salesperson"""
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """UPDATE salespeople SET
                name=%s, role=%s, email=%s, phone=%s, joining_date=%s,
                department=%s, employment_status=%s
                WHERE salesperson_id=%s""",
                (salesperson.name, salesperson.role, salesperson.email,
                 salesperson.phone, salesperson.joining_date, salesperson.department,
                 salesperson.employment_status, salesperson_id)
            )
            if cur.rowcount == 0:
                raise HTTPException(status_code=404, detail="Salesperson not found")
    return {"message": "Salesperson updated successfully"}

# ==========================================
# CUSTOMER ENDPOINTS
# ==========================================

@app.get("/api/customers")
def get_customers(status: Optional[str] = None, type: Optional[str] = None):
    """Get all customers"""
    with get_db() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            query = "SELECT * FROM customers WHERE 1=1"
            params = []
            if status:
                query += " AND status = %s"
                params.append(status)
            if type:
                query += " AND type = %s"
                params.append(type)
            cur.execute(query, params)
            return cur.fetchall()

@app.get("/api/customers/{customer_id}")
def get_customer(customer_id: str):
    """Get customer by ID"""
    with get_db() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT * FROM customers WHERE customer_id = %s", (customer_id,))
            result = cur.fetchone()
            if not result:
                raise HTTPException(status_code=404, detail="Customer not found")
            return result

@app.post("/api/customers")
def create_customer(customer: CustomerBase):
    """Create new customer"""
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """INSERT INTO customers
                (customer_id, client_name, industry, type, focus_account, cin_number,
                 status, onboarding_date, hunter_id, farmer_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                (customer.customer_id, customer.client_name, customer.industry,
                 customer.type, customer.focus_account, customer.cin_number,
                 customer.status, customer.onboarding_date, customer.hunter_id, customer.farmer_id)
            )
    return {"message": "Customer created successfully", "id": customer.customer_id}

@app.put("/api/customers/{customer_id}")
def update_customer(customer_id: str, customer: CustomerBase):
    """Update customer"""
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """UPDATE customers SET
                client_name=%s, industry=%s, type=%s, focus_account=%s, cin_number=%s,
                status=%s, onboarding_date=%s, hunter_id=%s, farmer_id=%s
                WHERE customer_id=%s""",
                (customer.client_name, customer.industry, customer.type,
                 customer.focus_account, customer.cin_number, customer.status,
                 customer.onboarding_date, customer.hunter_id, customer.farmer_id, customer_id)
            )
            if cur.rowcount == 0:
                raise HTTPException(status_code=404, detail="Customer not found")
    return {"message": "Customer updated successfully"}

# ==========================================
# INVOICE ENDPOINTS
# ==========================================

@app.get("/api/invoices")
def get_invoices(
    customer_id: Optional[str] = None,
    quarter: Optional[str] = None,
    fiscal_year: Optional[int] = None,
    revenue_category: Optional[str] = None
):
    """Get all invoices with optional filters"""
    with get_db() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            query = "SELECT * FROM invoices WHERE 1=1"
            params = []
            if customer_id:
                query += " AND customer_id = %s"
                params.append(customer_id)
            if quarter:
                query += " AND quarter = %s"
                params.append(quarter)
            if fiscal_year:
                query += " AND fiscal_year = %s"
                params.append(fiscal_year)
            if revenue_category:
                query += " AND revenue_category = %s"
                params.append(revenue_category)
            query += " ORDER BY invoice_date DESC"
            cur.execute(query, params)
            return cur.fetchall()

@app.post("/api/invoices")
def create_invoice(invoice: InvoiceBase):
    """Create new invoice"""
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """INSERT INTO invoices
                (invoice_id, customer_id, invoice_date, usage_month, account_type,
                 revenue_type, product_service, revenue_category, quarter, amount, gst,
                 billing_status, owner_id, notes, fiscal_year)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                (invoice.invoice_id, invoice.customer_id, invoice.invoice_date,
                 invoice.usage_month, invoice.account_type, invoice.revenue_type,
                 invoice.product_service, invoice.revenue_category, invoice.quarter,
                 invoice.amount, invoice.gst, invoice.billing_status, invoice.owner_id,
                 invoice.notes, invoice.fiscal_year)
            )
    return {"message": "Invoice created successfully", "id": invoice.invoice_id}

# ==========================================
# DASHBOARD & ANALYTICS ENDPOINTS
# ==========================================

@app.get("/api/dashboard/metrics")
def get_dashboard_metrics():
    """Get dashboard key metrics"""
    with get_db() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT * FROM vw_dashboard_metrics")
            result = cur.fetchone()
            return result if result else {}

@app.get("/api/analytics/customer-achievements")
def get_customer_achievements(fiscal_year: Optional[int] = None, customer_id: Optional[str] = None):
    """Get customer quarterly achievements"""
    with get_db() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            query = "SELECT * FROM vw_customer_quarterly_achievements WHERE 1=1"
            params = []
            if fiscal_year:
                query += " AND fiscal_year = %s"
                params.append(fiscal_year)
            if customer_id:
                query += " AND customer_id = %s"
                params.append(customer_id)
            cur.execute(query, params)
            return cur.fetchall()

@app.get("/api/analytics/salesperson-achievements")
def get_salesperson_achievements(fiscal_year: Optional[int] = None, salesperson_id: Optional[str] = None):
    """Get salesperson quarterly achievements"""
    with get_db() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            query = "SELECT * FROM vw_salesperson_quarterly_achievements WHERE 1=1"
            params = []
            if fiscal_year:
                query += " AND fiscal_year = %s"
                params.append(fiscal_year)
            if salesperson_id:
                query += " AND salesperson_id = %s"
                params.append(salesperson_id)
            cur.execute(query, params)
            return cur.fetchall()

@app.get("/api/analytics/collections")
def get_collections_summary(payment_status: Optional[str] = None):
    """Get collections summary"""
    with get_db() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            query = "SELECT * FROM vw_collections_summary WHERE 1=1"
            params = []
            if payment_status:
                query += " AND payment_status = %s"
                params.append(payment_status)
            query += " ORDER BY invoice_date DESC"
            cur.execute(query, params)
            return cur.fetchall()

# ==========================================
# TARGET ENDPOINTS
# ==========================================

@app.post("/api/targets/customer")
def create_customer_target(target: CustomerTargetBase):
    """Create customer targets"""
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """INSERT INTO customer_targets
                (customer_id, fiscal_year, annual_netnew_target, annual_retention_target,
                 q1_netnew_target, q1_retention_target, q2_netnew_target, q2_retention_target,
                 q3_netnew_target, q3_retention_target, q4_netnew_target, q4_retention_target)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (customer_id, fiscal_year) DO UPDATE SET
                annual_netnew_target = EXCLUDED.annual_netnew_target,
                annual_retention_target = EXCLUDED.annual_retention_target,
                q1_netnew_target = EXCLUDED.q1_netnew_target,
                q1_retention_target = EXCLUDED.q1_retention_target,
                q2_netnew_target = EXCLUDED.q2_netnew_target,
                q2_retention_target = EXCLUDED.q2_retention_target,
                q3_netnew_target = EXCLUDED.q3_netnew_target,
                q3_retention_target = EXCLUDED.q3_retention_target,
                q4_netnew_target = EXCLUDED.q4_netnew_target,
                q4_retention_target = EXCLUDED.q4_retention_target""",
                (target.customer_id, target.fiscal_year, target.annual_netnew_target,
                 target.annual_retention_target, target.q1_netnew_target, target.q1_retention_target,
                 target.q2_netnew_target, target.q2_retention_target, target.q3_netnew_target,
                 target.q3_retention_target, target.q4_netnew_target, target.q4_retention_target)
            )
    return {"message": "Customer target saved successfully"}

@app.post("/api/targets/salesperson")
def create_salesperson_target(target: SalespersonTargetBase):
    """Create salesperson targets"""
    with get_db() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """INSERT INTO salesperson_targets
                (salesperson_id, fiscal_year, annual_netnew_target, annual_retention_target,
                 q1_netnew_target, q1_retention_target, q2_netnew_target, q2_retention_target,
                 q3_netnew_target, q3_retention_target, q4_netnew_target, q4_retention_target)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (salesperson_id, fiscal_year) DO UPDATE SET
                annual_netnew_target = EXCLUDED.annual_netnew_target,
                annual_retention_target = EXCLUDED.annual_retention_target,
                q1_netnew_target = EXCLUDED.q1_netnew_target,
                q1_retention_target = EXCLUDED.q1_retention_target,
                q2_netnew_target = EXCLUDED.q2_netnew_target,
                q2_retention_target = EXCLUDED.q2_retention_target,
                q3_netnew_target = EXCLUDED.q3_netnew_target,
                q3_retention_target = EXCLUDED.q3_retention_target,
                q4_netnew_target = EXCLUDED.q4_netnew_target,
                q4_retention_target = EXCLUDED.q4_retention_target""",
                (target.salesperson_id, target.fiscal_year, target.annual_netnew_target,
                 target.annual_retention_target, target.q1_netnew_target, target.q1_retention_target,
                 target.q2_netnew_target, target.q2_retention_target, target.q3_netnew_target,
                 target.q3_retention_target, target.q4_netnew_target, target.q4_retention_target)
            )
    return {"message": "Salesperson target saved successfully"}

# ==========================================
# MAIN
# ==========================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
