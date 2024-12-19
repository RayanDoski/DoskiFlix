from flask import Blueprint, jsonify, request, session 
import hashlib
from db import db

# Create the blueprint
views = Blueprint('views', __name__)

@views.route('/api/isloggedin', methods=['GET', 'POST'])
def isLoggedIn():
    if 'LoggedIn' in session:
        return jsonify({'success': True})
    else:
        return jsonify({'success': False})

@views.route('/api/login', methods=['POST'])
def login():

    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    try:

        cursor = db.cursor()

        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()

        if user:
            hashed_password = user[4]
            if hashlib.sha256(password.encode()).hexdigest() == hashed_password:
                session['LoggedIn'] = True
                return jsonify({'success': True, 'message': 'Login successful'})
            else:
                return jsonify({'success': False, 'message': 'Invalid email or password'}), 401
        else:
            return jsonify({'success': False, 'message': 'Invalid email or password'}), 401
    finally:
        db.close()
        cursor.close()

@views.route('/api/register', methods=['GET', 'POST'])
def register():
    try:
        data = request.get_json()
        firstname = data.get('firstname')
        lastname = data.get('lastname')
        email = data.get('email')
        password = data.get('password')

        cursor = db.cursor()
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        if user:
            return jsonify({'success': False, 'message': 'Email already exists'}), 409

        hashed_password = hashlib.sha256(password.encode()).hexdigest()

        cursor.execute("INSERT INTO users (firstname, lastname, email, password) VALUES (%s, %s, %s, %s)", (firstname, lastname, email, hashed_password))
        db.commit()

        return jsonify({'success': True})
    finally:
        db.close()
        cursor.close()