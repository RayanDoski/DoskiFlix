import requests
import API_KEY

from flask import Blueprint, jsonify, request, session 
import json, os, hashlib

# Create the blueprint
Chatgpt = Blueprint('chatgpt', __name__)

@Chatgpt.route('/api/generate/movie/ideas', methods=['POST'])
def chatgpt():
    try:
        # Get the user's input
        data = request.get_json()

        url = "https://chatgpt-42.p.rapidapi.com/chatgpt"

        payload = {
            "messages": [
                {
                    "role": "user", #the status of the user

                    "content": f"You are a movie recomendation AI, give me a list of five movies to watch. Give only the movie titles as recomendations, you response should be in JSON format and nothing else whatsoever, here are the movies that the specific user has liked and diskliked, please tailor the recomendations based on there prefrences. List of liked and disliked movies: {data}" 
                }
            ],
            "web_access": False
        }

        headers = {
            "x-rapidapi-key": API_KEY.x_rapidapi_key,
            "x-rapidapi-host": "chatgpt-42.p.rapidapi.com",
            "Content-Type": "application/json"
        }

        response = requests.post(url, json=payload, headers=headers)

        return jsonify({'success': True, 'movieTips': response.json()}), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500