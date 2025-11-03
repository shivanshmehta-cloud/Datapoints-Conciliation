-- ==========================================
-- SALES DATA MANAGEMENT HUB - DATABASE SCHEMA
-- ==========================================
-- Comprehensive schema for managing customers, salespeople, products,
-- invoices, agreements, collections, and deals with complete business logic
-- ==========================================

-- Drop existing tables (in reverse order of dependencies)
DROP TABLE IF EXISTS collections CASCADE;
DROP TABLE IF EXISTS invoice_items CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS deals CASCADE;
DROP TABLE IF EXISTS agreements CASCADE;
DROP TABLE IF EXISTS customer_targets CASCADE;
DROP TABLE IF EXISTS salesperson_targets CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS salespeople CASCADE;

-- ==========================================
-- CORE ENTITY TABLES
-- ==========================================

-- Salespeople Master Table
CREATE TABLE salespeople (
    salesperson_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50), -- Hunter, Farmer, Hunter/Farmer
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    joining_date DATE,
    department VARCHAR(100),
    employment_status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_salespeople_status ON salespeople(employment_status);
CREATE INDEX idx_salespeople_role ON salespeople(role);

-- Customers Master Table
CREATE TABLE customers (
    customer_id VARCHAR(20) PRIMARY KEY,
    client_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    type VARCHAR(50), -- Enterprise, Existing, etc.
    focus_account BOOLEAN DEFAULT FALSE,
    cin_number VARCHAR(50),
    status VARCHAR(20) DEFAULT 'Active',
    onboarding_date DATE,
    hunter_id VARCHAR(20), -- Salesperson responsible for new business
    farmer_id VARCHAR(20), -- Salesperson responsible for retention
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hunter_id) REFERENCES salespeople(salesperson_id) ON DELETE SET NULL,
    FOREIGN KEY (farmer_id) REFERENCES salespeople(salesperson_id) ON DELETE SET NULL
);

CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_customers_hunter ON customers(hunter_id);
CREATE INDEX idx_customers_farmer ON customers(farmer_id);
CREATE INDEX idx_customers_type ON customers(type);

-- Products Master Table
CREATE TABLE products (
    product_id VARCHAR(20) PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    base_price DECIMAL(15, 2),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(is_active);

-- ==========================================
-- TRANSACTION TABLES
-- ==========================================

-- Invoices Table
CREATE TABLE invoices (
    invoice_id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(20) NOT NULL,
    invoice_date DATE NOT NULL,
    usage_month DATE,
    account_type VARCHAR(50), -- Type of Account
    revenue_type VARCHAR(50), -- MRR, ARR, One-time
    product_service VARCHAR(50), -- Product/Service
    revenue_category VARCHAR(20) NOT NULL, -- Net New or Retention
    quarter VARCHAR(5) NOT NULL, -- Q1, Q2, Q3, Q4
    hunting_farming VARCHAR(20), -- Hunting or Farming
    amount DECIMAL(15, 2) NOT NULL,
    gst DECIMAL(15, 2),
    total_amount DECIMAL(15, 2) NOT NULL,
    billing_status VARCHAR(20) DEFAULT 'Unbilled', -- Billed/Unbilled
    owner_id VARCHAR(20), -- Salesperson who owns this invoice
    notes TEXT,
    fiscal_year INTEGER, -- e.g., 2025
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
    FOREIGN KEY (owner_id) REFERENCES salespeople(salesperson_id) ON DELETE SET NULL
);

CREATE INDEX idx_invoices_customer ON invoices(customer_id);
CREATE INDEX idx_invoices_owner ON invoices(owner_id);
CREATE INDEX idx_invoices_quarter ON invoices(quarter);
CREATE INDEX idx_invoices_category ON invoices(revenue_category);
CREATE INDEX idx_invoices_date ON invoices(invoice_date);
CREATE INDEX idx_invoices_fiscal_year ON invoices(fiscal_year);
CREATE INDEX idx_invoices_usage_month ON invoices(usage_month);

-- Collections Table
CREATE TABLE collections (
    collection_id SERIAL PRIMARY KEY,
    invoice_id VARCHAR(50) NOT NULL,
    invoice_date DATE,
    due_date DATE,
    invoice_amount DECIMAL(15, 2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'Pending', -- Pending, Paid, Overdue
    collection_date DATE,
    amount_collected DECIMAL(15, 2) DEFAULT 0,
    balance_outstanding DECIMAL(15, 2),
    days_outstanding INTEGER,
    collection_efficiency DECIMAL(5, 4), -- Percentage
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id) ON DELETE CASCADE
);

CREATE INDEX idx_collections_invoice ON collections(invoice_id);
CREATE INDEX idx_collections_status ON collections(payment_status);
CREATE INDEX idx_collections_date ON collections(collection_date);

-- Agreements Table
CREATE TABLE agreements (
    agreement_id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(20) NOT NULL,
    agreement_type VARCHAR(50), -- Annual, Multi-year
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    contract_value DECIMAL(15, 2),
    payment_terms VARCHAR(50), -- Monthly, Quarterly, Annual
    auto_renewal BOOLEAN DEFAULT FALSE,
    notice_period_days INTEGER,
    status VARCHAR(20) DEFAULT 'Active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

CREATE INDEX idx_agreements_customer ON agreements(customer_id);
CREATE INDEX idx_agreements_status ON agreements(status);
CREATE INDEX idx_agreements_dates ON agreements(start_date, end_date);

-- Deals (HubSpot Pipeline) Table
CREATE TABLE deals (
    deal_id VARCHAR(50) PRIMARY KEY,
    deal_name VARCHAR(255) NOT NULL,
    customer_id VARCHAR(20),
    owner_id VARCHAR(20),
    stage VARCHAR(50), -- Discovery, Qualification, Proposal, Negotiation, Closed Won, Closed Lost
    amount DECIMAL(15, 2),
    arr DECIMAL(15, 2), -- Annual Recurring Revenue
    one_time_amount DECIMAL(15, 2),
    expected_golive_date DATE,
    close_date DATE,
    q1_revenue DECIMAL(15, 2) DEFAULT 0,
    q2_revenue DECIMAL(15, 2) DEFAULT 0,
    q3_revenue DECIMAL(15, 2) DEFAULT 0,
    q4_revenue DECIMAL(15, 2) DEFAULT 0,
    fiscal_year INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE SET NULL,
    FOREIGN KEY (owner_id) REFERENCES salespeople(salesperson_id) ON DELETE SET NULL
);

CREATE INDEX idx_deals_customer ON deals(customer_id);
CREATE INDEX idx_deals_owner ON deals(owner_id);
CREATE INDEX idx_deals_stage ON deals(stage);
CREATE INDEX idx_deals_close_date ON deals(close_date);

-- ==========================================
-- TARGETS TABLES
-- ==========================================

-- Customer Targets Table
CREATE TABLE customer_targets (
    target_id SERIAL PRIMARY KEY,
    customer_id VARCHAR(20) NOT NULL,
    fiscal_year INTEGER NOT NULL,
    annual_netnew_target DECIMAL(15, 2) DEFAULT 0,
    annual_retention_target DECIMAL(15, 2) DEFAULT 0,
    q1_netnew_target DECIMAL(15, 2) DEFAULT 0,
    q1_retention_target DECIMAL(15, 2) DEFAULT 0,
    q2_netnew_target DECIMAL(15, 2) DEFAULT 0,
    q2_retention_target DECIMAL(15, 2) DEFAULT 0,
    q3_netnew_target DECIMAL(15, 2) DEFAULT 0,
    q3_retention_target DECIMAL(15, 2) DEFAULT 0,
    q4_netnew_target DECIMAL(15, 2) DEFAULT 0,
    q4_retention_target DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
    UNIQUE(customer_id, fiscal_year)
);

CREATE INDEX idx_customer_targets_customer ON customer_targets(customer_id);
CREATE INDEX idx_customer_targets_year ON customer_targets(fiscal_year);

-- Salesperson Targets Table
CREATE TABLE salesperson_targets (
    target_id SERIAL PRIMARY KEY,
    salesperson_id VARCHAR(20) NOT NULL,
    fiscal_year INTEGER NOT NULL,
    annual_netnew_target DECIMAL(15, 2) DEFAULT 0,
    annual_retention_target DECIMAL(15, 2) DEFAULT 0,
    q1_netnew_target DECIMAL(15, 2) DEFAULT 0,
    q1_retention_target DECIMAL(15, 2) DEFAULT 0,
    q2_netnew_target DECIMAL(15, 2) DEFAULT 0,
    q2_retention_target DECIMAL(15, 2) DEFAULT 0,
    q3_netnew_target DECIMAL(15, 2) DEFAULT 0,
    q3_retention_target DECIMAL(15, 2) DEFAULT 0,
    q4_netnew_target DECIMAL(15, 2) DEFAULT 0,
    q4_retention_target DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (salesperson_id) REFERENCES salespeople(salesperson_id) ON DELETE CASCADE,
    UNIQUE(salesperson_id, fiscal_year)
);

CREATE INDEX idx_salesperson_targets_salesperson ON salesperson_targets(salesperson_id);
CREATE INDEX idx_salesperson_targets_year ON salesperson_targets(fiscal_year);

-- ==========================================
-- TRIGGER FUNCTIONS FOR AUTO-UPDATES
-- ==========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_salespeople_updated_at BEFORE UPDATE ON salespeople
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agreements_updated_at BEFORE UPDATE ON agreements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-calculate GST and total on invoice
CREATE OR REPLACE FUNCTION calculate_invoice_totals()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate GST if not provided (18% default)
    IF NEW.gst IS NULL THEN
        NEW.gst := NEW.amount * 0.18;
    END IF;

    -- Calculate total amount
    NEW.total_amount := NEW.amount + NEW.gst;

    -- Determine hunting/farming based on revenue category
    IF NEW.revenue_category = 'Net New' THEN
        NEW.hunting_farming := 'Hunting';
    ELSE
        NEW.hunting_farming := 'Farming';
    END IF;

    -- Extract fiscal year from invoice date
    IF NEW.fiscal_year IS NULL THEN
        NEW.fiscal_year := EXTRACT(YEAR FROM NEW.invoice_date);
    END IF;

    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER invoice_calculate_totals
    BEFORE INSERT OR UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION calculate_invoice_totals();

-- Function to auto-calculate collection metrics
CREATE OR REPLACE FUNCTION calculate_collection_metrics()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate balance outstanding
    NEW.balance_outstanding := NEW.invoice_amount - COALESCE(NEW.amount_collected, 0);

    -- Calculate days outstanding
    IF NEW.payment_status != 'Paid' AND NEW.invoice_date IS NOT NULL THEN
        NEW.days_outstanding := CURRENT_DATE - NEW.invoice_date;
    ELSE
        NEW.days_outstanding := 0;
    END IF;

    -- Calculate collection efficiency
    IF NEW.invoice_amount > 0 THEN
        NEW.collection_efficiency := COALESCE(NEW.amount_collected, 0) / NEW.invoice_amount;
    ELSE
        NEW.collection_efficiency := 0;
    END IF;

    -- Auto-update payment status
    IF NEW.balance_outstanding <= 0 AND NEW.amount_collected > 0 THEN
        NEW.payment_status := 'Paid';
    ELSIF NEW.due_date IS NOT NULL AND NEW.due_date < CURRENT_DATE AND NEW.balance_outstanding > 0 THEN
        NEW.payment_status := 'Overdue';
    END IF;

    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER collection_calculate_metrics
    BEFORE INSERT OR UPDATE ON collections
    FOR EACH ROW EXECUTE FUNCTION calculate_collection_metrics();

-- ==========================================
-- COMMENTS FOR DOCUMENTATION
-- ==========================================

COMMENT ON TABLE salespeople IS 'Master table for all sales team members';
COMMENT ON TABLE customers IS 'Master table for all customers with hunter/farmer assignments';
COMMENT ON TABLE products IS 'Product catalog with pricing information';
COMMENT ON TABLE invoices IS 'All invoice transactions with revenue categorization';
COMMENT ON TABLE collections IS 'Payment tracking linked to invoices';
COMMENT ON TABLE agreements IS 'Customer contracts and terms';
COMMENT ON TABLE deals IS 'Sales pipeline from HubSpot';
COMMENT ON TABLE customer_targets IS 'Quarterly and annual targets by customer';
COMMENT ON TABLE salesperson_targets IS 'Quarterly and annual targets by salesperson';

-- ==========================================
-- INITIAL SETUP COMPLETE
-- ==========================================
