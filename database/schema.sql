-- Prometheus CRM Database Schema for Supabase
-- Execute these SQL commands in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  tier TEXT CHECK (tier IN ('REV1', 'REV2', 'REV3')) DEFAULT 'REV1',
  status TEXT CHECK (status IN ('active', 'trial', 'churned')) DEFAULT 'trial',
  mrr DECIMAL(10,2) DEFAULT 0,
  ltv DECIMAL(10,2) DEFAULT 0,
  join_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create an updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE
    ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO customers (name, email, tier, status, mrr, ltv, join_date) VALUES
('John Doe', 'john@example.com', 'REV1', 'active', 29.00, 348.00, '2024-01-15'),
('Jane Smith', 'jane@example.com', 'REV2', 'active', 199.00, 2388.00, '2024-02-20'),
('Mike Johnson', 'mike@example.com', 'REV1', 'trial', 0.00, 0.00, '2024-07-10'),
('Sarah Wilson', 'sarah@example.com', 'REV3', 'active', 499.00, 5988.00, '2024-03-05'),
('David Brown', 'david@example.com', 'REV1', 'churned', 0.00, 58.00, '2024-05-12'),
('Lisa Garcia', 'lisa@example.com', 'REV2', 'active', 299.00, 1794.00, '2024-04-18'),
('Tom Anderson', 'tom@example.com', 'REV1', 'trial', 0.00, 0.00, '2024-07-08'),
('Emily Davis', 'emily@example.com', 'REV1', 'active', 19.00, 228.00, '2024-06-22'),
('Mark Thompson', 'mark@example.com', 'REV2', 'churned', 0.00, 398.00, '2024-01-30'),
('Anna Martinez', 'anna@example.com', 'REV1', 'active', 29.00, 174.00, '2024-06-01'),
('Chris Lee', 'chris@example.com', 'REV3', 'active', 699.00, 4194.00, '2024-02-14'),
('Jessica Taylor', 'jessica@example.com', 'REV1', 'trial', 0.00, 0.00, '2024-07-11')
ON CONFLICT (email) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (adjust as needed)
CREATE POLICY "Enable read access for authenticated users" ON customers
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users" ON customers
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON customers
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON customers
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_tier ON customers(tier);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at);

-- Grant permissions to authenticated users
GRANT ALL ON customers TO authenticated;
GRANT ALL ON customers TO service_role;
