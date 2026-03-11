INSERT INTO users (email, password, role, height_cm, weight_kg, google_id) VALUES 
  ('maksymiliandymitr@chasacademy.se', 'password', 'Admin', 171, 100, NULL)
ON CONFLICT (email) DO NOTHING;
