-- ==========================================
-- VIEWS AND STORED PROCEDURES
-- ==========================================
-- Business logic calculations for achievements, targets, and metrics
-- ==========================================

-- ==========================================
-- HELPER FUNCTIONS
-- ==========================================

-- Function to determine quarter from date
CREATE OR REPLACE FUNCTION get_quarter_from_date(input_date DATE)
RETURNS VARCHAR(5) AS $$
DECLARE
    month_num INTEGER;
    quarter_num INTEGER;
BEGIN
    month_num := EXTRACT(MONTH FROM input_date);

    -- Fiscal year starts in April (month 4)
    -- Q1: Apr-Jun (4,5,6)
    -- Q2: Jul-Sep (7,8,9)
    -- Q3: Oct-Dec (10,11,12)
    -- Q4: Jan-Mar (1,2,3)

    IF month_num >= 4 AND month_num <= 6 THEN
        quarter_num := 1;
    ELSIF month_num >= 7 AND month_num <= 9 THEN
        quarter_num := 2;
    ELSIF month_num >= 10 AND month_num <= 12 THEN
        quarter_num := 3;
    ELSE
        quarter_num := 4;
    END IF;

    RETURN 'Q' || quarter_num::VARCHAR;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ==========================================
-- CUSTOMER ACHIEVEMENT VIEWS
-- ==========================================

-- Customer Quarterly Achievements View
CREATE OR REPLACE VIEW vw_customer_quarterly_achievements AS
WITH quarterly_actuals AS (
    SELECT
        customer_id,
        fiscal_year,
        quarter,
        revenue_category,
        SUM(amount) as achievement
    FROM invoices
    WHERE billing_status = 'Billed'
    GROUP BY customer_id, fiscal_year, quarter, revenue_category
)
SELECT
    c.customer_id,
    c.client_name,
    c.industry,
    c.type,
    c.status,
    c.hunter_id,
    c.farmer_id,
    ct.fiscal_year,

    -- Annual Targets
    ct.annual_netnew_target,
    ct.annual_retention_target,
    (ct.annual_netnew_target + ct.annual_retention_target) as annual_total_target,

    -- Q1 Metrics
    ct.q1_netnew_target,
    COALESCE((SELECT achievement FROM quarterly_actuals WHERE customer_id = c.customer_id AND quarter = 'Q1' AND revenue_category = 'Net New' AND fiscal_year = ct.fiscal_year), 0) as q1_netnew_ach,
    ct.q1_retention_target,
    COALESCE((SELECT achievement FROM quarterly_actuals WHERE customer_id = c.customer_id AND quarter = 'Q1' AND revenue_category = 'Retention' AND fiscal_year = ct.fiscal_year), 0) as q1_retention_ach,
    (ct.q1_netnew_target + ct.q1_retention_target) as q1_total_target,
    COALESCE((SELECT SUM(achievement) FROM quarterly_actuals WHERE customer_id = c.customer_id AND quarter = 'Q1' AND fiscal_year = ct.fiscal_year), 0) as q1_total_ach,
    (COALESCE((SELECT SUM(achievement) FROM quarterly_actuals WHERE customer_id = c.customer_id AND quarter = 'Q1' AND fiscal_year = ct.fiscal_year), 0) - (ct.q1_netnew_target + ct.q1_retention_target)) as q1_gap,
    CASE
        WHEN (ct.q1_netnew_target + ct.q1_retention_target) = 0 THEN 0
        ELSE COALESCE((SELECT SUM(achievement) FROM quarterly_actuals WHERE customer_id = c.customer_id AND quarter = 'Q1' AND fiscal_year = ct.fiscal_year), 0) / (ct.q1_netnew_target + ct.q1_retention_target)
    END as q1_ach_pct,

    -- Q2 Metrics
    ct.q2_netnew_target,
    COALESCE((SELECT achievement FROM quarterly_actuals WHERE customer_id = c.customer_id AND quarter = 'Q2' AND revenue_category = 'Net New' AND fiscal_year = ct.fiscal_year), 0) as q2_netnew_ach,
    ct.q2_retention_target,
    COALESCE((SELECT achievement FROM quarterly_actuals WHERE customer_id = c.customer_id AND quarter = 'Q2' AND revenue_category = 'Retention' AND fiscal_year = ct.fiscal_year), 0) as q2_retention_ach,
    (ct.q2_netnew_target + ct.q2_retention_target) as q2_total_target,
    COALESCE((SELECT SUM(achievement) FROM quarterly_actuals WHERE customer_id = c.customer_id AND quarter = 'Q2' AND fiscal_year = ct.fiscal_year), 0) as q2_total_ach,
    (COALESCE((SELECT SUM(achievement) FROM quarterly_actuals WHERE customer_id = c.customer_id AND quarter = 'Q2' AND fiscal_year = ct.fiscal_year), 0) - (ct.q2_netnew_target + ct.q2_retention_target)) as q2_gap,
    CASE
        WHEN (ct.q2_netnew_target + ct.q2_retention_target) = 0 THEN 0
        ELSE COALESCE((SELECT SUM(achievement) FROM quarterly_actuals WHERE customer_id = c.customer_id AND quarter = 'Q2' AND fiscal_year = ct.fiscal_year), 0) / (ct.q2_netnew_target + ct.q2_retention_target)
    END as q2_ach_pct,

    -- Q3 Metrics
    ct.q3_netnew_target,
    COALESCE((SELECT achievement FROM quarterly_actuals WHERE customer_id = c.customer_id AND quarter = 'Q3' AND revenue_category = 'Net New' AND fiscal_year = ct.fiscal_year), 0) as q3_netnew_ach,
    ct.q3_retention_target,
    COALESCE((SELECT achievement FROM quarterly_actuals WHERE customer_id = c.customer_id AND quarter = 'Q3' AND revenue_category = 'Retention' AND fiscal_year = ct.fiscal_year), 0) as q3_retention_ach,
    (ct.q3_netnew_target + ct.q3_retention_target) as q3_total_target,
    COALESCE((SELECT SUM(achievement) FROM quarterly_actuals WHERE customer_id = c.customer_id AND quarter = 'Q3' AND fiscal_year = ct.fiscal_year), 0) as q3_total_ach,
    (COALESCE((SELECT SUM(achievement) FROM quarterly_actuals WHERE customer_id = c.customer_id AND quarter = 'Q3' AND fiscal_year = ct.fiscal_year), 0) - (ct.q3_netnew_target + ct.q3_retention_target)) as q3_gap,
    CASE
        WHEN (ct.q3_netnew_target + ct.q3_retention_target) = 0 THEN 0
        ELSE COALESCE((SELECT SUM(achievement) FROM quarterly_actuals WHERE customer_id = c.customer_id AND quarter = 'Q3' AND fiscal_year = ct.fiscal_year), 0) / (ct.q3_netnew_target + ct.q3_retention_target)
    END as q3_ach_pct,

    -- Q4 Metrics
    ct.q4_netnew_target,
    COALESCE((SELECT achievement FROM quarterly_actuals WHERE customer_id = c.customer_id AND quarter = 'Q4' AND revenue_category = 'Net New' AND fiscal_year = ct.fiscal_year), 0) as q4_netnew_ach,
    ct.q4_retention_target,
    COALESCE((SELECT achievement FROM quarterly_actuals WHERE customer_id = c.customer_id AND quarter = 'Q4' AND revenue_category = 'Retention' AND fiscal_year = ct.fiscal_year), 0) as q4_retention_ach,
    (ct.q4_netnew_target + ct.q4_retention_target) as q4_total_target,
    COALESCE((SELECT SUM(achievement) FROM quarterly_actuals WHERE customer_id = c.customer_id AND quarter = 'Q4' AND fiscal_year = ct.fiscal_year), 0) as q4_total_ach,
    (COALESCE((SELECT SUM(achievement) FROM quarterly_actuals WHERE customer_id = c.customer_id AND quarter = 'Q4' AND fiscal_year = ct.fiscal_year), 0) - (ct.q4_netnew_target + ct.q4_retention_target)) as q4_gap,
    CASE
        WHEN (ct.q4_netnew_target + ct.q4_retention_target) = 0 THEN 0
        ELSE COALESCE((SELECT SUM(achievement) FROM quarterly_actuals WHERE customer_id = c.customer_id AND quarter = 'Q4' AND fiscal_year = ct.fiscal_year), 0) / (ct.q4_netnew_target + ct.q4_retention_target)
    END as q4_ach_pct,

    -- YTD Metrics
    ct.annual_netnew_target as ytd_netnew_target,
    COALESCE((SELECT SUM(achievement) FROM quarterly_actuals WHERE customer_id = c.customer_id AND revenue_category = 'Net New' AND fiscal_year = ct.fiscal_year), 0) as ytd_netnew_ach,
    ct.annual_retention_target as ytd_retention_target,
    COALESCE((SELECT SUM(achievement) FROM quarterly_actuals WHERE customer_id = c.customer_id AND revenue_category = 'Retention' AND fiscal_year = ct.fiscal_year), 0) as ytd_retention_ach,
    (ct.annual_netnew_target + ct.annual_retention_target) as ytd_total_target,
    COALESCE((SELECT SUM(achievement) FROM quarterly_actuals WHERE customer_id = c.customer_id AND fiscal_year = ct.fiscal_year), 0) as ytd_total_ach,
    (COALESCE((SELECT SUM(achievement) FROM quarterly_actuals WHERE customer_id = c.customer_id AND fiscal_year = ct.fiscal_year), 0) - (ct.annual_netnew_target + ct.annual_retention_target)) as ytd_gap,
    CASE
        WHEN (ct.annual_netnew_target + ct.annual_retention_target) = 0 THEN 0
        ELSE COALESCE((SELECT SUM(achievement) FROM quarterly_actuals WHERE customer_id = c.customer_id AND fiscal_year = ct.fiscal_year), 0) / (ct.annual_netnew_target + ct.annual_retention_target)
    END as ytd_ach_pct

FROM customers c
LEFT JOIN customer_targets ct ON c.customer_id = ct.customer_id
WHERE c.status = 'Active';

COMMENT ON VIEW vw_customer_quarterly_achievements IS 'Complete customer achievement tracking with quarterly breakdown';

-- ==========================================
-- SALESPERSON ACHIEVEMENT VIEWS
-- ==========================================

-- Salesperson Quarterly Achievements View
CREATE OR REPLACE VIEW vw_salesperson_quarterly_achievements AS
WITH quarterly_actuals AS (
    SELECT
        owner_id as salesperson_id,
        fiscal_year,
        quarter,
        revenue_category,
        SUM(amount) as achievement
    FROM invoices
    WHERE billing_status = 'Billed'
    GROUP BY owner_id, fiscal_year, quarter, revenue_category
)
SELECT
    s.salesperson_id,
    s.name,
    s.role,
    s.email,
    s.department,
    s.employment_status,
    ROUND((EXTRACT(EPOCH FROM (CURRENT_DATE - s.joining_date)) / 2592000)::numeric, 0) as tenure_months,
    CASE
        WHEN ROUND((EXTRACT(EPOCH FROM (CURRENT_DATE - s.joining_date)) / 2592000)::numeric, 0) >= 12 THEN 'Experienced'
        ELSE 'New Joiner'
    END as tenure_status,
    st.fiscal_year,

    -- Annual Targets
    st.annual_netnew_target,
    st.annual_retention_target,
    (st.annual_netnew_target + st.annual_retention_target) as annual_total_target,

    -- Q1 Metrics
    st.q1_netnew_target,
    COALESCE((SELECT achievement FROM quarterly_actuals WHERE salesperson_id = s.salesperson_id AND quarter = 'Q1' AND revenue_category = 'Net New' AND fiscal_year = st.fiscal_year), 0) as q1_netnew_ach,
    st.q1_retention_target,
    COALESCE((SELECT achievement FROM quarterly_actuals WHERE salesperson_id = s.salesperson_id AND quarter = 'Q1' AND revenue_category = 'Retention' AND fiscal_year = st.fiscal_year), 0) as q1_retention_ach,
    (st.q1_netnew_target + st.q1_retention_target) as q1_total_target,
    COALESCE((SELECT SUM(achievement) FROM quarterly_actuals WHERE salesperson_id = s.salesperson_id AND quarter = 'Q1' AND fiscal_year = st.fiscal_year), 0) as q1_total_ach,
    (COALESCE((SELECT SUM(achievement) FROM quarterly_actuals WHERE salesperson_id = s.salesperson_id AND quarter = 'Q1' AND fiscal_year = st.fiscal_year), 0) - (st.q1_netnew_target + st.q1_retention_target)) as q1_gap,
    CASE
        WHEN (st.q1_netnew_target + st.q1_retention_target) = 0 THEN 0
        ELSE COALESCE((SELECT SUM(achievement) FROM quarterly_actuals WHERE salesperson_id = s.salesperson_id AND quarter = 'Q1' AND fiscal_year = st.fiscal_year), 0) / (st.q1_netnew_target + st.q1_retention_target)
    END as q1_ach_pct,

    -- Q2 Metrics
    st.q2_netnew_target,
    COALESCE((SELECT achievement FROM quarterly_actuals WHERE salesperson_id = s.salesperson_id AND quarter = 'Q2' AND revenue_category = 'Net New' AND fiscal_year = st.fiscal_year), 0) as q2_netnew_ach,
    st.q2_retention_target,
    COALESCE((SELECT achievement FROM quarterly_actuals WHERE salesperson_id = s.salesperson_id AND quarter = 'Q2' AND revenue_category = 'Retention' AND fiscal_year = st.fiscal_year), 0) as q2_retention_ach,
    (st.q2_netnew_target + st.q2_retention_target) as q2_total_target,
    COALESCE((SELECT SUM(achievement) FROM quarterly_actuals WHERE salesperson_id = s.salesperson_id AND quarter = 'Q2' AND fiscal_year = st.fiscal_year), 0) as q2_total_ach,
    (COALESCE((SELECT SUM(achievement) FROM quarterly_actuals WHERE salesperson_id = s.salesperson_id AND quarter = 'Q2' AND fiscal_year = st.fiscal_year), 0) - (st.q2_netnew_target + st.q2_retention_target)) as q2_gap,
    CASE
        WHEN (st.q2_netnew_target + st.q2_retention_target) = 0 THEN 0
        ELSE COALESCE((SELECT SUM(achievement) FROM quarterly_actuals WHERE salesperson_id = s.salesperson_id AND quarter = 'Q2' AND fiscal_year = st.fiscal_year), 0) / (st.q2_netnew_target + st.q2_retention_target)
    END as q2_ach_pct,

    -- Q3 Metrics
    st.q3_netnew_target,
    COALESCE((SELECT achievement FROM quarterly_actuals WHERE salesperson_id = s.salesperson_id AND quarter = 'Q3' AND revenue_category = 'Net New' AND fiscal_year = st.fiscal_year), 0) as q3_netnew_ach,
    st.q3_retention_target,
    COALESCE((SELECT achievement FROM quarterly_actuals WHERE salesperson_id = s.salesperson_id AND quarter = 'Q3' AND revenue_category = 'Retention' AND fiscal_year = st.fiscal_year), 0) as q3_retention_ach,
    (st.q3_netnew_target + st.q3_retention_target) as q3_total_target,
    COALESCE((SELECT SUM(achievement) FROM quarterly_actuals WHERE salesperson_id = s.salesperson_id AND quarter = 'Q3' AND fiscal_year = st.fiscal_year), 0) as q3_total_ach,
    (COALESCE((SELECT SUM(achievement) FROM quarterly_actuals WHERE salesperson_id = s.salesperson_id AND quarter = 'Q3' AND fiscal_year = st.fiscal_year), 0) - (st.q3_netnew_target + st.q3_retention_target)) as q3_gap,
    CASE
        WHEN (st.q3_netnew_target + st.q3_retention_target) = 0 THEN 0
        ELSE COALESCE((SELECT SUM(achievement) FROM quarterly_actuals WHERE salesperson_id = s.salesperson_id AND quarter = 'Q3' AND fiscal_year = st.fiscal_year), 0) / (st.q3_netnew_target + st.q3_retention_target)
    END as q3_ach_pct,

    -- Q4 Metrics
    st.q4_netnew_target,
    COALESCE((SELECT achievement FROM quarterly_actuals WHERE salesperson_id = s.salesperson_id AND quarter = 'Q4' AND revenue_category = 'Net New' AND fiscal_year = st.fiscal_year), 0) as q4_netnew_ach,
    st.q4_retention_target,
    COALESCE((SELECT achievement FROM quarterly_actuals WHERE salesperson_id = s.salesperson_id AND quarter = 'Q4' AND revenue_category = 'Retention' AND fiscal_year = st.fiscal_year), 0) as q4_retention_ach,
    (st.q4_netnew_target + st.q4_retention_target) as q4_total_target,
    COALESCE((SELECT SUM(achievement) FROM quarterly_actuals WHERE salesperson_id = s.salesperson_id AND quarter = 'Q4' AND fiscal_year = st.fiscal_year), 0) as q4_total_ach,
    (COALESCE((SELECT SUM(achievement) FROM quarterly_actuals WHERE salesperson_id = s.salesperson_id AND quarter = 'Q4' AND fiscal_year = st.fiscal_year), 0) - (st.q4_netnew_target + st.q4_retention_target)) as q4_gap,
    CASE
        WHEN (st.q4_netnew_target + st.q4_retention_target) = 0 THEN 0
        ELSE COALESCE((SELECT SUM(achievement) FROM quarterly_actuals WHERE salesperson_id = s.salesperson_id AND quarter = 'Q4' AND fiscal_year = st.fiscal_year), 0) / (st.q4_netnew_target + st.q4_retention_target)
    END as q4_ach_pct,

    -- YTD Metrics
    st.annual_netnew_target as ytd_netnew_target,
    COALESCE((SELECT SUM(achievement) FROM quarterly_actuals WHERE salesperson_id = s.salesperson_id AND revenue_category = 'Net New' AND fiscal_year = st.fiscal_year), 0) as ytd_netnew_ach,
    st.annual_retention_target as ytd_retention_target,
    COALESCE((SELECT SUM(achievement) FROM quarterly_actuals WHERE salesperson_id = s.salesperson_id AND revenue_category = 'Retention' AND fiscal_year = st.fiscal_year), 0) as ytd_retention_ach,
    (st.annual_netnew_target + st.annual_retention_target) as ytd_total_target,
    COALESCE((SELECT SUM(achievement) FROM quarterly_actuals WHERE salesperson_id = s.salesperson_id AND fiscal_year = st.fiscal_year), 0) as ytd_total_ach,
    (COALESCE((SELECT SUM(achievement) FROM quarterly_actuals WHERE salesperson_id = s.salesperson_id AND fiscal_year = st.fiscal_year), 0) - (st.annual_netnew_target + st.annual_retention_target)) as ytd_gap,
    CASE
        WHEN (st.annual_netnew_target + st.annual_retention_target) = 0 THEN 0
        ELSE COALESCE((SELECT SUM(achievement) FROM quarterly_actuals WHERE salesperson_id = s.salesperson_id AND fiscal_year = st.fiscal_year), 0) / (st.annual_netnew_target + st.annual_retention_target)
    END as ytd_ach_pct

FROM salespeople s
LEFT JOIN salesperson_targets st ON s.salesperson_id = st.salesperson_id
WHERE s.employment_status = 'Active';

COMMENT ON VIEW vw_salesperson_quarterly_achievements IS 'Complete salesperson achievement tracking with quarterly breakdown';

-- ==========================================
-- DASHBOARD METRICS VIEWS
-- ==========================================

-- Dashboard Key Metrics View
CREATE OR REPLACE VIEW vw_dashboard_metrics AS
WITH current_fiscal_year AS (
    SELECT EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER as fiscal_year
)
SELECT
    -- Key Counts
    (SELECT COUNT(*) FROM customers WHERE status = 'Active') as total_customers,
    (SELECT COUNT(*) FROM salespeople WHERE employment_status = 'Active') as total_salespeople,
    (SELECT COUNT(*) FROM products WHERE is_active = TRUE) as total_products,
    (SELECT COUNT(*) FROM deals WHERE stage NOT IN ('Closed Won', 'Closed Lost')) as active_deals,
    (SELECT COUNT(*) FROM invoices WHERE fiscal_year = (SELECT fiscal_year FROM current_fiscal_year)) as total_invoices_ytd,

    -- Team Performance Metrics (Q2 specific)
    (SELECT COALESCE(SUM(q2_netnew_target + q2_retention_target), 0)
     FROM salesperson_targets
     WHERE fiscal_year = (SELECT fiscal_year FROM current_fiscal_year)) as q2_team_target,

    (SELECT COALESCE(SUM(amount), 0)
     FROM invoices
     WHERE quarter = 'Q2'
     AND fiscal_year = (SELECT fiscal_year FROM current_fiscal_year)
     AND billing_status = 'Billed') as q2_team_achieved,

    CASE
        WHEN (SELECT COALESCE(SUM(q2_netnew_target + q2_retention_target), 0)
              FROM salesperson_targets
              WHERE fiscal_year = (SELECT fiscal_year FROM current_fiscal_year)) = 0 THEN 0
        ELSE (SELECT COALESCE(SUM(amount), 0)
              FROM invoices
              WHERE quarter = 'Q2'
              AND fiscal_year = (SELECT fiscal_year FROM current_fiscal_year)
              AND billing_status = 'Billed') /
             (SELECT COALESCE(SUM(q2_netnew_target + q2_retention_target), 1)
              FROM salesperson_targets
              WHERE fiscal_year = (SELECT fiscal_year FROM current_fiscal_year))
    END as q2_team_ach_pct,

    -- Collection Metrics
    (SELECT COALESCE(SUM(balance_outstanding), 0) FROM collections WHERE payment_status != 'Paid') as total_outstanding,
    (SELECT COALESCE(AVG(collection_efficiency), 0) FROM collections WHERE payment_status = 'Paid') as avg_collection_efficiency,

    -- Revenue by Type
    (SELECT COALESCE(SUM(amount), 0) FROM invoices WHERE revenue_category = 'Net New' AND fiscal_year = (SELECT fiscal_year FROM current_fiscal_year)) as ytd_netnew_revenue,
    (SELECT COALESCE(SUM(amount), 0) FROM invoices WHERE revenue_category = 'Retention' AND fiscal_year = (SELECT fiscal_year FROM current_fiscal_year)) as ytd_retention_revenue,
    (SELECT COALESCE(SUM(amount), 0) FROM invoices WHERE fiscal_year = (SELECT fiscal_year FROM current_fiscal_year)) as ytd_total_revenue,

    -- Deal Pipeline
    (SELECT COALESCE(SUM(amount), 0) FROM deals WHERE stage NOT IN ('Closed Won', 'Closed Lost')) as pipeline_value,
    (SELECT COALESCE(SUM(amount), 0) FROM deals WHERE stage = 'Closed Won' AND EXTRACT(YEAR FROM close_date) = (SELECT fiscal_year FROM current_fiscal_year)) as closed_won_value;

COMMENT ON VIEW vw_dashboard_metrics IS 'Executive dashboard key performance indicators';

-- ==========================================
-- COLLECTIONS SUMMARY VIEW
-- ==========================================

CREATE OR REPLACE VIEW vw_collections_summary AS
SELECT
    c.invoice_id,
    c.payment_status,
    c.invoice_amount,
    c.amount_collected,
    c.balance_outstanding,
    c.days_outstanding,
    c.collection_efficiency,
    c.invoice_date,
    c.due_date,
    c.collection_date,
    i.customer_id,
    cu.client_name,
    i.owner_id,
    s.name as owner_name,
    i.quarter,
    i.fiscal_year
FROM collections c
JOIN invoices i ON c.invoice_id = i.invoice_id
JOIN customers cu ON i.customer_id = cu.customer_id
LEFT JOIN salespeople s ON i.owner_id = s.salesperson_id;

COMMENT ON VIEW vw_collections_summary IS 'Collections tracking with customer and salesperson details';

-- ==========================================
-- STORED PROCEDURES
-- ==========================================

-- Procedure to refresh quarterly targets (auto-split annual targets)
CREATE OR REPLACE PROCEDURE sp_refresh_customer_targets(
    p_customer_id VARCHAR(20),
    p_fiscal_year INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_annual_netnew DECIMAL(15, 2);
    v_annual_retention DECIMAL(15, 2);
BEGIN
    SELECT annual_netnew_target, annual_retention_target
    INTO v_annual_netnew, v_annual_retention
    FROM customer_targets
    WHERE customer_id = p_customer_id AND fiscal_year = p_fiscal_year;

    IF FOUND THEN
        UPDATE customer_targets
        SET
            q1_netnew_target = v_annual_netnew / 4,
            q1_retention_target = v_annual_retention / 4,
            q2_netnew_target = v_annual_netnew / 4,
            q2_retention_target = v_annual_retention / 4,
            q3_netnew_target = v_annual_netnew / 4,
            q3_retention_target = v_annual_retention / 4,
            q4_netnew_target = v_annual_netnew / 4,
            q4_retention_target = v_annual_retention / 4,
            updated_at = CURRENT_TIMESTAMP
        WHERE customer_id = p_customer_id AND fiscal_year = p_fiscal_year;
    END IF;
END;
$$;

-- Procedure to refresh salesperson quarterly targets
CREATE OR REPLACE PROCEDURE sp_refresh_salesperson_targets(
    p_salesperson_id VARCHAR(20),
    p_fiscal_year INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_annual_netnew DECIMAL(15, 2);
    v_annual_retention DECIMAL(15, 2);
BEGIN
    SELECT annual_netnew_target, annual_retention_target
    INTO v_annual_netnew, v_annual_retention
    FROM salesperson_targets
    WHERE salesperson_id = p_salesperson_id AND fiscal_year = p_fiscal_year;

    IF FOUND THEN
        UPDATE salesperson_targets
        SET
            q1_netnew_target = v_annual_netnew / 4,
            q1_retention_target = v_annual_retention / 4,
            q2_netnew_target = v_annual_netnew / 4,
            q2_retention_target = v_annual_retention / 4,
            q3_netnew_target = v_annual_netnew / 4,
            q3_retention_target = v_annual_retention / 4,
            q4_netnew_target = v_annual_netnew / 4,
            q4_retention_target = v_annual_retention / 4,
            updated_at = CURRENT_TIMESTAMP
        WHERE salesperson_id = p_salesperson_id AND fiscal_year = p_fiscal_year;
    END IF;
END;
$$;

-- Procedure to auto-create collection records from billed invoices
CREATE OR REPLACE PROCEDURE sp_create_collections_from_invoices()
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO collections (invoice_id, invoice_date, due_date, invoice_amount)
    SELECT
        i.invoice_id,
        i.invoice_date,
        i.invoice_date + INTERVAL '30 days' as due_date,
        i.total_amount
    FROM invoices i
    WHERE i.billing_status = 'Billed'
    AND NOT EXISTS (
        SELECT 1 FROM collections c WHERE c.invoice_id = i.invoice_id
    );
END;
$$;

-- ==========================================
-- VIEWS AND PROCEDURES COMPLETE
-- ==========================================
