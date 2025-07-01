-- SympTrack AI Database Setup
-- Run this script in your MySQL database

CREATE DATABASE IF NOT EXISTS symptrack_ai;
USE symptrack_ai;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    age INT,
    gender ENUM('male', 'female', 'other'),
    medical_history TEXT,
    lifestyle TEXT,
    emergency_contact VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Predictions table
CREATE TABLE IF NOT EXISTS predictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    symptoms TEXT NOT NULL,
    additional_data JSON,
    prediction_result JSON,
    risk_score INT,
    risk_level ENUM('low', 'medium', 'high', 'critical'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Vlogs table
CREATE TABLE IF NOT EXISTS vlogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    disease VARCHAR(100),
    video_url VARCHAR(500),
    thumbnail VARCHAR(500),
    medicines TEXT,
    hospitals TEXT,
    likes INT DEFAULT 0,
    comments INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Community alerts table
CREATE TABLE IF NOT EXISTS community_alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('Disease Outbreak', 'Environmental', 'Hospital Updates', 'Public Health', 'Emergency'),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    severity ENUM('Low', 'Medium', 'High', 'Critical'),
    location VARCHAR(255),
    affected_count INT,
    source VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample community alerts
INSERT INTO community_alerts (type, title, description, severity, location, affected_count, source) VALUES
('Disease Outbreak', 'Flu Cases Rising in Downtown Area', 'Health officials report a 25% increase in flu cases in the downtown region over the past week. Vaccination recommended.', 'Medium', 'Downtown District', 156, 'Health Department'),
('Environmental', 'Air Quality Alert - High Pollution Levels', 'Air quality index has reached unhealthy levels due to industrial activity. Residents with respiratory conditions advised to stay indoors.', 'High', 'Industrial Zone', 3200, 'Environmental Agency'),
('Hospital Updates', 'Emergency Department Wait Times Extended', 'City General Hospital experiencing higher than normal patient volume. Estimated wait time: 3-4 hours for non-critical cases.', 'Low', 'City General Hospital', NULL, 'Hospital Administration'),
('Public Health', 'Water Quality Advisory Lifted', 'The boil water advisory for Riverside neighborhood has been lifted. Water is now safe to consume.', 'Low', 'Riverside Neighborhood', 850, 'Water Department'),
('Emergency', 'Mobile Vaccination Unit Available', 'Free COVID-19 and flu vaccinations available at Central Park mobile unit today from 9 AM to 5 PM.', 'Low', 'Central Park', NULL, 'Public Health Service');