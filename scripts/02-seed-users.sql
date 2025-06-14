-- Insert admin user (password: admin123)
INSERT INTO users (email, name, password_hash, role) 
VALUES (
  'admin@company.com', 
  'System Administrator', 
  '$2a$12$IX2.HsLALg/h7n2i8wuUQe4dwPnwL3CcqrWYXvn5M3//7RU9OjbD2', 
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Insert 20 distributor users (password: dist123)
INSERT INTO users (email, name, password_hash, role) VALUES
  ('distributor1@company.com', 'Distributor 1', '$2a$12$fX8Q9iboHw8aSWmIh/e2QOaULTu3Ep/O6XgcaraoHWXMtdoF2ymRG', 'distributor'),
  ('distributor2@company.com', 'Distributor 2', '$2a$12$fX8Q9iboHw8aSWmIh/e2QOaULTu3Ep/O6XgcaraoHWXMtdoF2ymRG', 'distributor'),
  ('distributor3@company.com', 'Distributor 3', '$2a$12$fX8Q9iboHw8aSWmIh/e2QOaULTu3Ep/O6XgcaraoHWXMtdoF2ymRG', 'distributor'),
  ('distributor4@company.com', 'Distributor 4', '$2a$12$fX8Q9iboHw8aSWmIh/e2QOaULTu3Ep/O6XgcaraoHWXMtdoF2ymRG', 'distributor'),
  ('distributor5@company.com', 'Distributor 5', '$2a$12$fX8Q9iboHw8aSWmIh/e2QOaULTu3Ep/O6XgcaraoHWXMtdoF2ymRG', 'distributor'),
  ('distributor6@company.com', 'Distributor 6', '$2a$12$fX8Q9iboHw8aSWmIh/e2QOaULTu3Ep/O6XgcaraoHWXMtdoF2ymRG', 'distributor'),
  ('distributor7@company.com', 'Distributor 7', '$2a$12$fX8Q9iboHw8aSWmIh/e2QOaULTu3Ep/O6XgcaraoHWXMtdoF2ymRG', 'distributor'),
  ('distributor8@company.com', 'Distributor 8', '$2a$12$fX8Q9iboHw8aSWmIh/e2QOaULTu3Ep/O6XgcaraoHWXMtdoF2ymRG', 'distributor'),
  ('distributor9@company.com', 'Distributor 9', '$2a$12$fX8Q9iboHw8aSWmIh/e2QOaULTu3Ep/O6XgcaraoHWXMtdoF2ymRG', 'distributor'),
  ('distributor10@company.com', 'Distributor 10', '$2a$12$fX8Q9iboHw8aSWmIh/e2QOaULTu3Ep/O6XgcaraoHWXMtdoF2ymRG', 'distributor'),
  ('distributor11@company.com', 'Distributor 11', '$2a$12$fX8Q9iboHw8aSWmIh/e2QOaULTu3Ep/O6XgcaraoHWXMtdoF2ymRG', 'distributor'),
  ('distributor12@company.com', 'Distributor 12', '$2a$12$fX8Q9iboHw8aSWmIh/e2QOaULTu3Ep/O6XgcaraoHWXMtdoF2ymRG', 'distributor'),
  ('distributor13@company.com', 'Distributor 13', '$2a$12$fX8Q9iboHw8aSWmIh/e2QOaULTu3Ep/O6XgcaraoHWXMtdoF2ymRG', 'distributor'),
  ('distributor14@company.com', 'Distributor 14', '$2a$12$fX8Q9iboHw8aSWmIh/e2QOaULTu3Ep/O6XgcaraoHWXMtdoF2ymRG', 'distributor'),
  ('distributor15@company.com', 'Distributor 15', '$2a$12$fX8Q9iboHw8aSWmIh/e2QOaULTu3Ep/O6XgcaraoHWXMtdoF2ymRG', 'distributor'),
  ('distributor16@company.com', 'Distributor 16', '$2a$12$fX8Q9iboHw8aSWmIh/e2QOaULTu3Ep/O6XgcaraoHWXMtdoF2ymRG', 'distributor'),
  ('distributor17@company.com', 'Distributor 17', '$2a$12$fX8Q9iboHw8aSWmIh/e2QOaULTu3Ep/O6XgcaraoHWXMtdoF2ymRG', 'distributor'),
  ('distributor18@company.com', 'Distributor 18', '$2a$12$fX8Q9iboHw8aSWmIh/e2QOaULTu3Ep/O6XgcaraoHWXMtdoF2ymRG', 'distributor'),
  ('distributor19@company.com', 'Distributor 19', '$2a$12$fX8Q9iboHw8aSWmIh/e2QOaULTu3Ep/O6XgcaraoHWXMtdoF2ymRG', 'distributor'),
  ('distributor20@company.com', 'Distributor 20', '$2a$12$fX8Q9iboHw8aSWmIh/e2QOaULTu3Ep/O6XgcaraoHWXMtdoF2ymRG', 'distributor')
ON CONFLICT (email) DO NOTHING;
