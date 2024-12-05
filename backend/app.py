from flask import Flask, send_from_directory, Blueprint
from flask_cors import CORS
import os 

from views import views

app = Flask(__name__, static_folder='../frontend/build')
# Update CORS to allow specific origins and support credentials
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000", "supports_credentials": True}},
     allow_headers=["Content-Type", "Authorization"],
     methods=["GET", "POST", "OPTIONS"])
# Register blueprint
app.register_blueprint(views)

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True, port=8000)