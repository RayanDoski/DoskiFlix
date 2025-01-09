import requests
import API_KEY

from flask import Blueprint, jsonify, request, session 
import json, os, hashlib
from API_KEY import omdb_api_key

# Create the blueprint
Chatgpt = Blueprint('chatgpt', __name__)

@Chatgpt.route('/api/generate/movie/ideas', methods=['POST'])
def chatgpt():
    try:
        # Get the user's input
        data = request.get_json()

        # First, get movie recommendations from ChatGPT
        url = "https://chatgpt-42.p.rapidapi.com/chatgpt"
        payload = {
            "messages": [
                {
                    "role": "user",
                    "content": f"""You are a movie recomendation AI, give me a list of five movies to watch, be volatile with the movies that you choose. Give only the movie titles as recomendations nothing more make at all no text no more information other than the titles, you are not to give any text other than the titles nor whitespace, you response should be in JSON format and nothing else whatsoever make it look only like this , here are the movies that the specific user has liked and diskliked, please tailor the recomendations based on there prefrences. List of liked and disliked movies: {data}"""
                }
            ],
            "web_access": False
        }

        headers = {
            "x-rapidapi-key": API_KEY.x_rapidapi_key,
            "x-rapidapi-host": "chatgpt-42.p.rapidapi.com",
            "Content-Type": "application/json"
        }

        chatgpt_response = requests.post(url, json=payload, headers=headers)
        chatgpt_data = chatgpt_response.json()

        # Parse the nested result string into an object to get recommendations
        parsed_tips = json.loads(chatgpt_data['result'])
        recommendations = parsed_tips['recommendations']

        # Fetch OMDB data for each recommended movie
        movies_with_details = []
        for movie_title in recommendations:
            url = f'https://www.omdbapi.com/?t={movie_title}&apikey={omdb_api_key}'
            response = requests.get(url)
            movie_data = response.json()
            if 'Error' not in movie_data:
                movies_with_details.append(movie_data)

        return jsonify({
            'success': True,
            'movieTips': movies_with_details
        }), 200

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500