from flask import Blueprint, jsonify, request, session 
import json, os, hashlib
from werkzeug.utils import secure_filename

# for the profile picture
UPLOAD_FOLDER = 'static/profile_images'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# function for the profile picture
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

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
            "password": hashed_password,
            "profileImg": 'defaultAvatar.png'
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
    
@loginSystem.route('/api/get/user/info', methods=['GET', 'POST'])
def get_user_info():
    # 1. Check if we have a user email in the session
    session_user_email = session['LoggedIn']
    if not session_user_email:
        return jsonify({"error": "User email not found in session"}), 401

    # 2. Read the user data from user.json
    with open("user.json", "r") as f:
        users_data = json.load(f)  # Assume this is a list of user objects

    # 3. Find the user whose email matches
    matching_user = next((u for u in users_data if u.get("email") == session_user_email), None)
    if not matching_user:
        return jsonify({"error": "No user found with that email"}), 404

    # 4. Return the user info in JSON format
    return jsonify({'success': True, 'info': matching_user}), 200

@loginSystem.route('/api/update/user/info', methods=['GET', 'POST'])
def update_user_info():
    data = request.get_json()
    firstname = data.get('firstname')
    lastname = data.get('lastname')
    email = data.get('email')

    with open("user.json", "r") as f:
        users_data = json.load(f)
    
    for user in users_data:
        if user['email'] == session['LoggedIn']:
            user['firstname'] = firstname
            user['lastname'] = lastname
            user['email'] = email

    with open("user.json", "w") as f:
        json.dump(users_data, f, indent=4)
    
    return jsonify({"success": True, "message": "User info updated"}), 200

@loginSystem.route('/api/update/user/profile/img', methods=['GET', 'POST'])
def update_user_profile_img():
    if 'file' not in request.files:
        return jsonify({"success": False, "message": "No file provided"}), 400
        
    file = request.files['file']
    filename = request.form.get('filename')
    
    if file and allowed_file(filename):
        filename = secure_filename(filename)
        # Change path to React's public folder
        upload_path = '../frontend/public/profile_img/'  # Adjust this path based on your project structure
        
        # Create directory if it doesn't exist
        os.makedirs(upload_path, exist_ok=True)
        
        file.save(os.path.join(upload_path, filename))
        
        with open("user.json", "r") as f:
            users_data = json.load(f)
        
        for user in users_data:
            if user['email'] == session['LoggedIn']:
                user['profileImg'] = filename
                
        with open("user.json", "w") as f:
            json.dump(users_data, f, indent=4)
        
        return jsonify({"success": True, "message": "Profile image updated"}), 200
        
    return jsonify({"success": False, "message": "Invalid file type"}), 400