import requests
import API_KEY
import json
import os

def read_json(file_path):
    """
    Reads JSON data from the specified file path.
    Returns an empty list if the file doesn't exist.
    """
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            return json.load(f)
    return []

def get_user_movies(user_email, file_path='likeAndDislike.json'):
    """
    Fetches liked and disliked movies for the given user email.
    Returns a dictionary with 'liked' and 'disliked' movies.
    """
    data = read_json(file_path)
    liked_movies = [item['movie'] for item in data if item['email'].lower() == user_email.lower() and item.get('like') is True]
    disliked_movies = [item['movie'] for item in data if item['email'].lower() == user_email.lower() and item.get('like') is False]
    
    return {"liked": liked_movies, "disliked": disliked_movies}


#skapa route för att skicka filmerna till frontend
def aiBot(user_email):
    """
    Sends a request to the ChatGPT API to get movie recommendations based on user preferences.
    """
    # Get the user's liked and disliked movies
    user_movies = get_user_movies(user_email)
    liked_movies = user_movies['liked']
    disliked_movies = user_movies['disliked']
    
    # Convert liked and disliked movies into a string format for the bot
    liked_str = ", ".join(liked_movies) if liked_movies else "No liked movies"
    disliked_str = ", ".join(disliked_movies) if disliked_movies else "No disliked movies"
    
    # Command for the chatbot
    command = (f"Based on this list of liked movies: {liked_str}, and disliked movies: {disliked_str}, "
        "give 5 movie recommendations. Provide only the movie titles as recommendations in JSON format.")

    # API setup
    url = "https://chatgpt-42.p.rapidapi.com/chatgpt"
    payload = {
        "messages": [
            {
                "role": "user",
                "content": command
            }
        ],
        "web_access": False
    }
    headers = {
        "x-rapidapi-key": API_KEY.x_rapidapi_key,
        "x-rapidapi-host": "chatgpt-42.p.rapidapi.com",
        "Content-Type": "application/json"
    }

    # Make the API request
    response = requests.post(url, json=payload, headers=headers)
    
    if response.status_code == 200:
        # Print the JSON response from the chatbot
        print(response.json())
    else:
        # Print an error message if the API call fails
        print(f"Error: {response.status_code} - {response.text}")

aiBot()
