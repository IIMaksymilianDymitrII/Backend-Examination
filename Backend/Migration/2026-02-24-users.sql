CREATE TYPE user_role AS ENUM ('Admin', 'User');
-- enum creates a new variable with defined values, right now it's 'Admin' and 'User'

CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       email TEXT UNIQUE NOT NULL,
                       password TEXT ,
                       google_id TEXT UNIQUE ,
                       role user_role DEFAULT 'User', -- If you don't pick any it defaults to 'User'
                       height_cm INT CHECK (height_cm >0 AND height_cm <300),
                       weight_kg INT CHECK (weight_kg > 0 ),
                       created_at TIMESTAMP DEFAULT NOW()
);
