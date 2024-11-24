from flask import jsonify
from app import app

@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hello from Flask!"})

@app.route('/api/health', methods=['GET']) 
def health_check():
    return jsonify({"status": "healthy"})
