import requests
import API_KEY

from flask import Blueprint, jsonify, request, session 
import json, os, hashlib
from API_KEY import omdb_api_key

# Create the blueprint
Chatgpt = Blueprint('chatgpt', __name__)

@Chatgpt.route('/api/generate_movie_ideas', methods=['POST'])
def chatgpt():
    try:
        # Get the user's input
        data = request.get_json()

        url = "https://open-ai21.p.rapidapi.com/conversationgpt35"
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
            "x-rapidapi-host": "open-ai21.p.rapidapi.com",
            "Content-Type": "application/json"
        }

        # Make request to OpenAI API
        chatgpt_response = requests.post(url, json=payload, headers=headers)
        
        # Print response for debugging
        print("OpenAI API Response:", chatgpt_response.text)
        
        # Check if the response is successful
        if chatgpt_response.status_code != 200:
            return jsonify({
                'success': False,
                'error': f'OpenAI API returned status code {chatgpt_response.status_code}'
            }), 500

        chatgpt_data = chatgpt_response.json()
        
        # Check if 'result' exists in the response
        if 'result' not in chatgpt_data:
            return jsonify({
                'success': False,
                'error': 'Unexpected API response format'
            }), 500

        # Try to parse the result
        try:
            parsed_tips = json.loads(chatgpt_data['result'])
        except json.JSONDecodeError as e:
            return jsonify({
                'success': False,
                'error': f'Failed to parse API response: {str(e)}'
            }), 500

        # Check if recommendations exist
        if 'recommendations' not in parsed_tips:
            return jsonify({
                'success': False,
                'error': 'No recommendations found in response'
            }), 500

        recommendations = parsed_tips['recommendations']

        # Fetch OMDB data
        movies_with_details = []
        for movie_title in recommendations:
            try:
                url = f'https://www.omdbapi.com/?t={movie_title}&apikey={omdb_api_key}'
                response = requests.get(url)
                movie_data = response.json()
                if 'Error' not in movie_data:
                    movies_with_details.append(movie_data)
            except Exception as e:
                print(f"Error fetching OMDB data for {movie_title}: {str(e)}")
                continue

        if not movies_with_details:
            return jsonify({
                'success': False,
                'error': 'No valid movies found'
            }), 500

        return jsonify({
            'success': True,
            'movieTips': movies_with_details
        }), 200

    except Exception as e:
        print(f"Server error: {str(e)}")  # Log the full error
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500