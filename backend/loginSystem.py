from flask import Blueprint, jsonify, request, session 
import json, os, hashlib
from werkzeug.utils import secure_filename

# Create the blueprint
loginSystem = Blueprint('loginSystem', __name__)

# Configuration
UPLOAD_FOLDER = 'static/profile_images'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@loginSystem.route('/api', methods=['GET'])
def get_session():
    return "This is Doskiflix API"

@loginSystem.route('/api/session/status', methods=['GET'])
def get_session_status():
    if 'LoggedIn' in session:
        return jsonify({'success': True, 'authenticated': True}), 200
    return jsonify({'authenticated': False}), 200

@loginSystem.route('/api/session', methods=['POST'])
def create_session():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    with open('user.json', 'r') as f:
        users = json.load(f)

    user = next((u for u in users if u['email'] == email), None)

    if user and hashlib.sha256(password.encode()).hexdigest() == user.get('password'):
        session['LoggedIn'] = email
        return jsonify({'success': True, 'message': 'Login successful'}), 201
    
    return jsonify({'error': 'Invalid credentials'}), 401

@loginSystem.route('/api/session', methods=['DELETE'])
def delete_session():
    session.pop('LoggedIn', None)
    return jsonify({'success': True})

@loginSystem.route('/api/users', methods=['POST'])
def create_user():
    try:
        data = request.get_json()
        email = data.get('email')
        
        json_file = 'user.json'
        if not os.path.exists(json_file):
            with open(json_file, 'w') as f:
                json.dump([], f)

        with open(json_file, 'r') as f:
            users = json.load(f)

        if any(user['email'] == email for user in users):
            return jsonify({'error': 'Email already exists'}), 409

        new_user = {
            "firstname": data.get('firstname'),
            "lastname": data.get('lastname'),
            "email": email,
            "password": hashlib.sha256(data.get('password').encode()).hexdigest(),
            "profileImg": 'defaultAvatar.png'
        }

        users.append(new_user)

        with open(json_file, 'w') as f:
            json.dump(users, f, indent=4)

        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@loginSystem.route('/api/users/current', methods=['GET'])
def get_current_user():
    if 'LoggedIn' not in session:
        return jsonify({"error": "Unauthorized"}), 401

    with open("user.json", "r") as f:
        users_data = json.load(f)

    user = next((u for u in users_data if u.get("email") == session['LoggedIn']), None)
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({'success': True, 'info': user}), 200

@loginSystem.route('/api/users/current', methods=['PUT'])
def update_current_user():
    data = request.get_json()

    with open("user.json", "r") as f:
        users_data = json.load(f)
    
    user = next((u for u in users_data if u['email'] == session['LoggedIn']), None)
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.update({
        'firstname': data.get('firstname'),
        'lastname': data.get('lastname'),
        'email': data.get('email')
    })

    with open("user.json", "w") as f:
        json.dump(users_data, f, indent=4)
    
    return jsonify({'success': True})

@loginSystem.route('/api/users/current/avatar', methods=['PUT'])
def update_user_avatar():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
        
    file = request.files['file']
    filename = request.form.get('filename')
    
    if not file or not allowed_file(filename):
        return jsonify({"error": "Invalid file type"}), 400

    filename = secure_filename(filename)
    upload_path = '../frontend/public/profile_img/'
    os.makedirs(upload_path, exist_ok=True)
    file.save(os.path.join(upload_path, filename))
    
    with open("user.json", "r") as f:
        users_data = json.load(f)
    
    user = next((u for u in users_data if u['email'] == session['LoggedIn']), None)
    if user:
        user['profileImg'] = filename
        with open("user.json", "w") as f:
            json.dump(users_data, f, indent=4)
        return '', 204
        
    return jsonify({"error": "User not found"}), 404