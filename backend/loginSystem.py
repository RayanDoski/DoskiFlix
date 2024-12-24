from flask import Blueprint, jsonify, request, session 
import json, os, hashlib

# Create the blueprint
loginSystem = Blueprint('loginSystem', __name__)

@loginSystem.route('/api/isloggedin', methods=['GET', 'POST'])
def isLoggedIn():
    if 'LoggedIn' in session:
        return jsonify({'success': True})
    else:
        return jsonify({'success': False})

@loginSystem.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    json_file = 'user.json'

    # Read existing users
    with open(json_file, 'r') as f:
        users = json.load(f)

        # Look for a user with the matching email
        user = None
        for u in users:
            if u['email'] == email:
                user = u
                break

        if user:
            # Hash the incoming password and compare with stored hash
            hashed_input_password = hashlib.sha256(password.encode()).hexdigest()
            if hashed_input_password == user.get('password'):
                # If passwords match, mark session as logged in
                session['LoggedIn'] = email
                return jsonify({'success': True, 'message': 'Login successful'}), 200
            else:
                # If password mismatch
                return jsonify({'success': False, 'message': 'Invalid email or password'}), 401
        else:
            # If no user found with that email
            return jsonify({'success': False, 'message': 'Invalid email or password'}), 401

@loginSystem.route('/api/register', methods=['GET', 'POST'])
def register():
    try:
        data = request.get_json()
        firstname = data.get('firstname')
        lastname = data.get('lastname')
        email = data.get('email')
        password = data.get('password')

        # JSON file path
        json_file = 'user.json'

        # If the file does not exist, create it and initialize with empty list
        if not os.path.exists(json_file):
            with open(json_file, 'w') as f:
                json.dump([], f)

        # Read existing users
        with open(json_file, 'r') as f:
            users = json.load(f)

        # Check if the email already exists
        for user in users:
            if user['email'] == email:
                return jsonify({'success': False, 'message': 'Email already exists'}), 409

        # Hash the password
        hashed_password = hashlib.sha256(password.encode()).hexdigest()

        # Create new user object
        new_user = {
            "firstname": firstname,
            "lastname": lastname,
            "email": email,
            "password": hashed_password
        }

        # Append to list
        users.append(new_user)

        # Write the updated list back to the file
        with open(json_file, 'w') as f:
            json.dump(users, f, indent=4)

        return jsonify({'success': True}), 200
    except Exception as e:
        # In case of any unexpected error, return a 500 response
        return jsonify({'success': False}), 500