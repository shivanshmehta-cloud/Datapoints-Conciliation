#!/bin/bash

# ==========================================
# Database Initialization Script
# ==========================================
# This script sets up PostgreSQL database for Sales Data Management Hub
# ==========================================

# Configuration
DB_NAME=${DB_NAME:-"sales_data_hub"}
DB_USER=${DB_USER:-"sales_admin"}
DB_PASSWORD=${DB_PASSWORD:-"sales_secure_pass_2025"}
DB_HOST=${DB_HOST:-"localhost"}
DB_PORT=${DB_PORT:-"5432"}

echo "=========================================="
echo "Sales Data Management Hub - Database Setup"
echo "=========================================="
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "ERROR: PostgreSQL is not installed or not in PATH"
    echo "Please install PostgreSQL first"
    exit 1
fi

echo "✓ PostgreSQL found"
echo ""

# Check if running as postgres user or with sudo
if [ "$EUID" -eq 0 ]; then
    PSQL_CMD="sudo -u postgres psql"
else
    PSQL_CMD="psql"
fi

echo "Step 1: Creating database and user..."
echo "--------------------------------------"

# Create database and user
$PSQL_CMD -h $DB_HOST -p $DB_PORT -U postgres << EOF
-- Create user if not exists
DO \$\$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$DB_USER') THEN
      CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
   END IF;
END
\$\$;

-- Create database if not exists
SELECT 'CREATE DATABASE $DB_NAME OWNER $DB_USER'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
EOF

if [ $? -eq 0 ]; then
    echo "✓ Database and user created successfully"
else
    echo "✗ Failed to create database or user"
    exit 1
fi

echo ""
echo "Step 2: Creating schema (tables, indexes, triggers)..."
echo "--------------------------------------"

# Run schema creation
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$(dirname "$0")/schema.sql"

if [ $? -eq 0 ]; then
    echo "✓ Schema created successfully"
else
    echo "✗ Failed to create schema"
    exit 1
fi

echo ""
echo "Step 3: Creating views and stored procedures..."
echo "--------------------------------------"

# Run views and procedures
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$(dirname "$0")/views_and_procedures.sql"

if [ $? -eq 0 ]; then
    echo "✓ Views and procedures created successfully"
else
    echo "✗ Failed to create views and procedures"
    exit 1
fi

echo ""
echo "=========================================="
echo "Database initialization completed!"
echo "=========================================="
echo ""
echo "Database Details:"
echo "  Name:     $DB_NAME"
echo "  User:     $DB_USER"
echo "  Host:     $DB_HOST"
echo "  Port:     $DB_PORT"
echo ""
echo "Connection string:"
echo "  postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
echo ""
echo "Next steps:"
echo "  1. Run the data migration script: python3 migrate_data.py"
echo "  2. Start the API server: python3 app.py"
echo ""
