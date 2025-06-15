-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'distributor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment_records table
CREATE TABLE IF NOT EXISTS payment_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_name VARCHAR(255) NOT NULL,
  account_number VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  bank_code VARCHAR(50) NOT NULL,
  reference VARCHAR(255) NOT NULL,
  payment_date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create record_assignments table
CREATE TABLE IF NOT EXISTS record_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  record_id UUID NOT NULL REFERENCES payment_records(id) ON DELETE CASCADE,
  distributor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  payment_date DATE NOT NULL,
  UNIQUE(record_id, distributor_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payment_records_status ON payment_records(status);
CREATE INDEX IF NOT EXISTS idx_payment_records_payment_date ON payment_records(payment_date);
CREATE INDEX IF NOT EXISTS idx_payment_records_upload_date ON payment_records(upload_date);
CREATE INDEX IF NOT EXISTS idx_record_assignments_distributor ON record_assignments(distributor_id);
CREATE INDEX IF NOT EXISTS idx_record_assignments_payment_date ON record_assignments(payment_date);
CREATE INDEX IF NOT EXISTS idx_record_assignments_assigned_date ON record_assignments(assigned_date);
