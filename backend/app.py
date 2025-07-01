from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
import mysql.connector
from mysql.connector import Error
import bcrypt
from datetime import datetime, timedelta
import os
from werkzeug.utils import secure_filename
import uuid
import json
import random

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'my-very-secret-dev-key-123!@#'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)
app.config['UPLOAD_FOLDER'] = 'uploads'

jwt = JWTManager(app)
CORS(app)

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'database': 'symptrack_ai',
    'user': 'root',
    'password': 'saha@19982005'  # Change this to your MySQL password
}

# Create uploads directory if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def get_db_connection():
    """Create database connection"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

def init_database():
    """Initialize database tables"""
    connection = get_db_connection()
    if not connection:
        return
    
    cursor = connection.cursor()
    
    # Users table
    cursor.execute('''
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
        )
    ''')
    
    # Predictions table
    cursor.execute('''
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
        )
    ''')
    
    # Vlogs table
    cursor.execute('''
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
        )
    ''')
    
    # Community alerts table
    cursor.execute('''
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
        )
    ''')
    
    connection.commit()
    cursor.close()
    connection.close()
    print("Database initialized successfully")

# Simple ML prediction function (placeholder)
def predict_disease(symptoms, age=None, gender=None, lifestyle=None, medical_history=None):
    """Simple rule-based disease prediction"""
    symptoms_lower = symptoms.lower()
    conditions = []
    risk_score = 20  # Base low risk
    
    # Common conditions based on symptoms
    if any(word in symptoms_lower for word in ['fever', 'temperature', 'hot']):
        if any(word in symptoms_lower for word in ['cough', 'throat', 'sore']):
            conditions.append({'name': 'Common Cold/Flu', 'probability': 75, 'risk_level': 'low'})
            risk_score = 30
        elif any(word in symptoms_lower for word in ['headache', 'body ache', 'tired']):
            conditions.append({'name': 'Viral Infection', 'probability': 65, 'risk_level': 'medium'})
            risk_score = 45
    
    if any(word in symptoms_lower for word in ['headache', 'head pain', 'migraine']):
        conditions.append({'name': 'Tension Headache', 'probability': 60, 'risk_level': 'low'})
        if any(word in symptoms_lower for word in ['nausea', 'light sensitivity']):
            conditions.append({'name': 'Migraine', 'probability': 70, 'risk_level': 'medium'})
            risk_score = 40
    
    if any(word in symptoms_lower for word in ['chest pain', 'heart', 'breathing']):
        conditions.append({'name': 'Possible Cardiac Issue', 'probability': 50, 'risk_level': 'high'})
        risk_score = 75
    
    if any(word in symptoms_lower for word in ['stomach', 'nausea', 'vomiting', 'diarrhea']):
        conditions.append({'name': 'Gastroenteritis', 'probability': 65, 'risk_level': 'medium'})
        risk_score = 35
    
    # Adjust risk based on age
    if age:
        if int(age) > 60:
            risk_score += 10
        elif int(age) < 18:
            risk_score += 5
    
    # Default recommendations
    recommendations = [
        "Monitor symptoms and stay hydrated",
        "Get adequate rest",
        "Consult healthcare provider if symptoms persist or worsen",
        "Take over-the-counter medications as appropriate"
    ]
    
    if risk_score > 60:
        recommendations.insert(0, "Seek immediate medical attention")
    
    return {
        'conditions': conditions if conditions else [{'name': 'No specific condition identified', 'probability': 0, 'risk_level': 'low'}],
        'risk_score': min(risk_score, 100),
        'risk_level': 'high' if risk_score > 60 else 'medium' if risk_score > 30 else 'low',
        'recommendations': recommendations
    }

# Authentication routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        phone = data.get('phone')
        age = data.get('age')
        gender = data.get('gender')
        
        if not all([name, email, password]):
            return jsonify({'message': 'Name, email and password are required'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Database connection failed'}), 500
        
        cursor = connection.cursor()
        
        # Check if user already exists
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({'message': 'User already exists'}), 400
        
        # Hash password
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Insert user
        cursor.execute('''
            INSERT INTO users (name, email, password_hash, phone, age, gender)
            VALUES (%s, %s, %s, %s, %s, %s)
        ''', (name, email, password_hash, phone, age, gender))
        
        user_id = cursor.lastrowid
        connection.commit()
        
        # Create access token
        access_token = create_access_token(identity=user_id)
        
        cursor.close()
        connection.close()
        
        return jsonify({
            'message': 'User created successfully',
            'token': access_token,
            'user': {'id': user_id, 'name': name, 'email': email}
        }), 201
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not all([email, password]):
            return jsonify({'message': 'Email and password are required'}), 400
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Database connection failed'}), 500
        
        cursor = connection.cursor()
        cursor.execute("SELECT id, name, email, password_hash FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        
        if not user or not bcrypt.checkpw(password.encode('utf-8'), user[3].encode('utf-8')):
            return jsonify({'message': 'Invalid credentials'}), 401
        
        access_token = create_access_token(identity=user[0])
        
        cursor.close()
        connection.close()
        
        return jsonify({
            'message': 'Login successful',
            'token': access_token,
            'user': {'id': user[0], 'name': user[1], 'email': user[2]}
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    try:
        user_id = get_jwt_identity()
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Database connection failed'}), 500
        
        cursor = connection.cursor()
        cursor.execute("SELECT id, name, email, phone, age, gender FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        cursor.close()
        connection.close()
        
        return jsonify({
            'user': {
                'id': user[0],
                'name': user[1],
                'email': user[2],
                'phone': user[3],
                'age': user[4],
                'gender': user[5]
            }
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Prediction routes
@app.route('/api/predictions/predict', methods=['POST'])
@jwt_required()
def make_prediction():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        symptoms = data.get('symptoms')
        age = data.get('age')
        gender = data.get('gender')
        lifestyle = data.get('lifestyle')
        medical_history = data.get('medicalHistory')
        
        if not symptoms:
            return jsonify({'message': 'Symptoms are required'}), 400
        
        # Make prediction
        prediction_result = predict_disease(symptoms, age, gender, lifestyle, medical_history)
        
        # Save to database
        connection = get_db_connection()
        if connection:
            cursor = connection.cursor()
            cursor.execute('''
                INSERT INTO predictions (user_id, symptoms, additional_data, prediction_result, risk_score, risk_level)
                VALUES (%s, %s, %s, %s, %s, %s)
            ''', (
                user_id,
                symptoms,
                json.dumps({'age': age, 'gender': gender, 'lifestyle': lifestyle, 'medical_history': medical_history}),
                json.dumps(prediction_result),
                prediction_result['risk_score'],
                prediction_result['risk_level']
            ))
            connection.commit()
            cursor.close()
            connection.close()
        
        return jsonify(prediction_result), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/predictions/history', methods=['GET'])
@jwt_required()
def get_prediction_history():
    try:
        user_id = get_jwt_identity()
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Database connection failed'}), 500
        
        cursor = connection.cursor()
        cursor.execute('''
            SELECT symptoms, risk_score, risk_level, created_at
            FROM predictions 
            WHERE user_id = %s 
            ORDER BY created_at DESC 
            LIMIT 10
        ''', (user_id,))
        
        predictions = []
        for row in cursor.fetchall():
            predictions.append({
                'symptoms': row[0],
                'risk_score': row[1],
                'risk_level': row[2],
                'created_at': row[3].isoformat() if row[3] else None
            })
        
        cursor.close()
        connection.close()
        
        return jsonify({'predictions': predictions}), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Vlog routes
@app.route('/api/vlogs', methods=['GET'])
@jwt_required()
def get_vlogs():
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Database connection failed'}), 500
        
        cursor = connection.cursor()
        cursor.execute('''
            SELECT v.id, v.title, v.description, v.disease, v.video_url, v.thumbnail,
                   v.medicines, v.hospitals, v.likes, v.comments, v.created_at,
                   u.name as author_name
            FROM vlogs v
            JOIN users u ON v.user_id = u.id
            ORDER BY v.created_at DESC
        ''')
        
        vlogs = []
        for row in cursor.fetchall():
            vlogs.append({
                'id': row[0],
                'title': row[1],
                'description': row[2],
                'disease': row[3],
                'video_url': row[4],
                'thumbnail': row[5],
                'medicines': row[6],
                'hospitals': row[7],
                'likes': row[8],
                'comments': row[9],
                'created_at': row[10].isoformat() if row[10] else None,
                'author_name': row[11]
            })
        
        cursor.close()
        connection.close()
        
        return jsonify({'vlogs': vlogs}), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/vlogs/<int:vlog_id>/like', methods=['POST'])
@jwt_required()
def like_vlog(vlog_id):
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Database connection failed'}), 500
        
        cursor = connection.cursor()
        cursor.execute('UPDATE vlogs SET likes = likes + 1 WHERE id = %s', (vlog_id,))
        connection.commit()
        cursor.close()
        connection.close()
        
        return jsonify({'message': 'Vlog liked successfully'}), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Community alerts routes
@app.route('/api/alerts', methods=['GET'])
@jwt_required()
def get_community_alerts():
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Database connection failed'}), 500
        
        cursor = connection.cursor()
        cursor.execute('''
            SELECT id, type, title, description, severity, location, affected_count, source, created_at
            FROM community_alerts
            ORDER BY created_at DESC
            LIMIT 20
        ''')
        
        alerts = []
        for row in cursor.fetchall():
            alerts.append({
                'id': row[0],
                'type': row[1],
                'title': row[2],
                'description': row[3],
                'severity': row[4],
                'location': row[5],
                'affected_count': row[6],
                'source': row[7],
                'created_at': row[8].isoformat() if row[8] else None
            })
        
        cursor.close()
        connection.close()
        
        return jsonify({'alerts': alerts}), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# Dashboard route
@app.route('/api/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard_data():
    try:
        user_id = get_jwt_identity()
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Database connection failed'}), 500
        
        cursor = connection.cursor()
        
        # Get user's average risk score
        cursor.execute('SELECT AVG(risk_score) FROM predictions WHERE user_id = %s', (user_id,))
        avg_risk = cursor.fetchone()[0] or 85
        
        # Get recent predictions count
        cursor.execute('SELECT COUNT(*) FROM predictions WHERE user_id = %s', (user_id,))
        prediction_count = cursor.fetchone()[0] or 0
        
        # Get community alerts count
        cursor.execute('SELECT COUNT(*) FROM community_alerts WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)')
        alerts_count = cursor.fetchone()[0] or 0
        
        cursor.close()
        connection.close()
        
        return jsonify({
            'riskScore': int(avg_risk),
            'recentPredictions': [],
            'healthTrends': [],
            'communityAlerts': [],
            'predictionCount': prediction_count,
            'alertsCount': alerts_count
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

# User profile routes
@app.route('/api/user/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    try:
        user_id = get_jwt_identity()
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Database connection failed'}), 500
        
        cursor = connection.cursor()
        cursor.execute('''
            SELECT name, email, phone, age, gender, medical_history, lifestyle, emergency_contact
            FROM users WHERE id = %s
        ''', (user_id,))
        
        user = cursor.fetchone()
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        profile = {
            'name': user[0],
            'email': user[1],
            'phone': user[2],
            'age': user[3],
            'gender': user[4],
            'medical_history': user[5],
            'lifestyle': user[6],
            'emergency_contact': user[7]
        }
        
        cursor.close()
        connection.close()
        
        return jsonify({'profile': profile}), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/user/profile', methods=['PUT'])
@jwt_required()
def update_user_profile():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Database connection failed'}), 500
        
        cursor = connection.cursor()
        cursor.execute('''
            UPDATE users SET 
                name = %s, email = %s, phone = %s, age = %s, gender = %s,
                medical_history = %s, lifestyle = %s, emergency_contact = %s
            WHERE id = %s
        ''', (
            data.get('name'),
            data.get('email'),
            data.get('phone'),
            data.get('age'),
            data.get('gender'),
            data.get('medical_history'),
            data.get('lifestyle'),
            data.get('emergency_contact'),
            user_id
        ))
        
        connection.commit()
        cursor.close()
        connection.close()
        
        return jsonify({'message': 'Profile updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/user/health-stats', methods=['GET'])
@jwt_required()
def get_health_stats():
    try:
        user_id = get_jwt_identity()
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'message': 'Database connection failed'}), 500
        
        cursor = connection.cursor()
        
        # Get predictions count
        cursor.execute('SELECT COUNT(*) FROM predictions WHERE user_id = %s', (user_id,))
        predictions_made = cursor.fetchone()[0] or 0
        
        # Get average risk score
        cursor.execute('SELECT AVG(risk_score) FROM predictions WHERE user_id = %s', (user_id,))
        avg_risk_score = cursor.fetchone()[0] or 0
        
        # Get vlogs count
        cursor.execute('SELECT COUNT(*) FROM vlogs WHERE user_id = %s', (user_id,))
        vlogs_shared = cursor.fetchone()[0] or 0
        
        cursor.close()
        connection.close()
        
        return jsonify({
            'stats': {
                'predictions_made': predictions_made,
                'avg_risk_score': int(avg_risk_score),
                'vlogs_shared': vlogs_shared,
                'community_score': random.randint(70, 95)  # Mock community score
            }
        }), 200
        
    except Exception as e:
        return jsonify({'message': str(e)}), 500

if __name__ == '__main__':
    init_database()
    app.run(debug=True, host='0.0.0.0', port=5000)