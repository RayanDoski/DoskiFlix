from flask import Flask, send_from_directory, Blueprint
from flask_cors import CORS
import os 
from dotenv import load_dotenv

from loginSystem import loginSystem
from movie import movie
from chatgpt import Chatgpt
from omdb import omdb

app = Flask(__name__, static_folder='../frontend/build')
app.secret_key = 'DoskiFlix12345'
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True

load_dotenv()
frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")

# Uppdaterad korrekt syntax för CORS
# Notera att "origins" nu är en lista för att hantera kommaseparerade värden
CORS(app, resources={r"/api/*": {"origins": [frontend_url], "supports_credentials": True}},
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "OPTIONS", "PUT", "DELETE"])

# Register blueprint
app.register_blueprint(loginSystem)
app.register_blueprint(movie)
app.register_blueprint(Chatgpt)
app.register_blueprint(omdb)

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True, port=8080)