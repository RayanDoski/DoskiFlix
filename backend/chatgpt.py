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
            "content": f"""You are a movie recommendation AI. Your task is to provide a list of five movie recommendations. Follow these instructions exactly:

            1. Only provide the movie titles as recommendations, strictly in JSON format. Do not include any introductory text, explanations, or comments—only the JSON object.
            2. Do not include any whitespace or text outside the JSON format.
            3. Tailor your recommendations to the user's preferences, which are provided in this list: {data}.
            4. Always generate five recommendations. Ensure that the recommendations vary every time.
            5. Your response must look *exactly* like this structure, with different movie titles every time:

            {{
                "recommendations": [
                    "The Hangover",
                    "Bridesmaids",
                    "Superbad",
                    "Forgetting Sarah Marshall",
                    "Anchorman: The Legend of Ron Burgundy"
                ]
            }}

            If your response includes anything other than the JSON structure shown above, it is invalid. Do not include explanations, genres, comments, or any text outside the JSON object. Only return the JSON object.
            """
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