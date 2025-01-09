from flask import Blueprint, jsonify, request, session 
import requests
import json, os
from API_KEY import omdb_api_key

# Create the blueprint
movie = Blueprint('movie', __name__)

@movie.route('/api/movie/watchlist/add', methods=['GET', 'POST'])
def watchlistAdd():

    data = request.get_json()
    MovieID = data.get('imdbID')

    # JSON file path
    json_file = 'watchlist.json'

    # If the file does not exist, create it and initialize with empty list
    if not os.path.exists(json_file):
        with open(json_file, 'w') as f:
            json.dump([], f)

    # Read existing watchlist
    with open(json_file, 'r') as f:
        watchlist = json.load(f)

    # Create new user object
    new_movie_to_watchlist = {
        "email": session['LoggedIn'],
        "movie": MovieID
    }

    # Append to list
    watchlist.append(new_movie_to_watchlist)

    # Write the updated list back to the file
    with open(json_file, 'w') as f:
        json.dump(watchlist, f, indent=4)

    return jsonify({'success': True}), 200

@movie.route('/api/movie/get/watchlist', methods=['GET', 'POST'])
def get_watchlist():
    try:
        # Load watchlist data from JSON
        with open('watchlist.json', 'r') as f:
            watchlist_data = json.load(f)

        # Filter to match the requested email
        user_watchlist = [item for item in watchlist_data if item['email'].lower() == session['LoggedIn'].lower()]

        # Fetch OMDB data for each movie in the watchlist
        movies_with_details = []
        for item in user_watchlist:
            url = f'https://www.omdbapi.com/?i={item["movie"]}&apikey={omdb_api_key}'
            response = requests.get(url)
            movie_data = response.json()
            movies_with_details.append(movie_data)

        return jsonify(movies_with_details)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@movie.route('/api/movie/get/watchlist/remove', methods=['GET', 'POST'])
def watchlistRemove():
    data = request.get_json()
    MovieID = data.get('imdbID')

    # JSON file path
    json_file = 'watchlist.json'

    # If file doesn't exist or is empty, safely return since there's nothing to remove
    if not os.path.exists(json_file):
        return jsonify({'success': False, 'message': 'Watchlist not found'}), 400

    # Load existing watchlist from JSON
    with open(json_file, 'r') as f:
        watchlist = json.load(f)

    # Filter out the item that matches both the logged in user's email and the MovieID
    updated_watchlist = [
        item for item in watchlist
        if not (item['email'].lower() == session['LoggedIn'].lower() and item['movie'] == MovieID)
    ]

    # Write the updated list back to the file
    with open(json_file, 'w') as f:
        json.dump(updated_watchlist, f, indent=4)

    return jsonify({'success': True}), 200


@movie.route('/api/movie/like/add', methods=['GET', 'POST'])
def movie_like_add():

    data = request.get_json()
    MovieID = data.get('imdbID')

    # JSON file path
    json_file = 'likeAndDislike.json'

    # If the file does not exist, create it and initialize with empty list
    if not os.path.exists(json_file):
        with open(json_file, 'w') as f:
            json.dump([], f)

    # Read existing watchlist
    with open(json_file, 'r') as f:
        watchlist = json.load(f)

    for wl in watchlist:
        if wl['movie'] == MovieID:
            if wl['like'] == True:
                return jsonify({'success': False, 'message': 'Movie already liked'}), 400
            else:
                wl['like'] = True
                return jsonify({'success': True}), 400

    # Create new user object
    new_movie_to_watchlist = {
        "email": session['LoggedIn'],
        "movie": MovieID,
        "like": True
    }

    # Append to list
    watchlist.append(new_movie_to_watchlist)

    # Write the updated list back to the file
    with open(json_file, 'w') as f:
        json.dump(watchlist, f, indent=4)

    return jsonify({'success': True}), 200

@movie.route('/api/movie/get/likes', methods=['GET', 'POST'])
def get_likes():
    try:
        json_file = 'likeAndDislike.json'

        # Return empty list if file doesn't exist
        if not os.path.exists(json_file):
            return jsonify([])

        with open(json_file, 'r') as f:
            all_likes_data = json.load(f)

        # Filter for user's liked movies
        user_likes = [
            item for item in all_likes_data
            if item['email'].lower() == session['LoggedIn'].lower() 
            and item.get('like') is True
        ]

        # Fetch OMDB data for each liked movie
        movies_with_details = []
        for item in user_likes:
            url = f'https://www.omdbapi.com/?i={item["movie"]}&apikey={omdb_api_key}'
            response = requests.get(url)
            movie_data = response.json()
            # Add the like status to the movie data
            movie_data['like'] = item['like']
            movies_with_details.append(movie_data)

        return jsonify(movies_with_details)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@movie.route('/api/movie/get/likes/remove', methods=['GET', 'POST'])
def likes_remove():
    data = request.get_json()
    MovieID = data.get('imdbID')

    # JSON file path
    json_file = 'likeAndDislike.json'

    # If file doesn't exist or is empty, safely return since there's nothing to remove
    if not os.path.exists(json_file):
        return jsonify({'success': False, 'message': 'Watchlist not found'}), 400

    # Load existing watchlist from JSON
    with open(json_file, 'r') as f:
        watchlist = json.load(f)

    # Filter out the item that matches both the logged in user's email and the MovieID
    updated_watchlist = [
        item for item in watchlist
        if not (item['email'].lower() == session['LoggedIn'].lower() and item['movie'] == MovieID)
    ]

    # Write the updated list back to the file
    with open(json_file, 'w') as f:
        json.dump(updated_watchlist, f, indent=4)

    return jsonify({'success': True}), 200


@movie.route('/api/movie/dislike/add', methods=['GET', 'POST'])
def movie_dislike_add():

    data = request.get_json()
    MovieID = data.get('imdbID')

    # JSON file path
    json_file = 'likeAndDislike.json'

    # If the file does not exist, create it and initialize with empty list
    if not os.path.exists(json_file):
        with open(json_file, 'w') as f:
            json.dump([], f)

    # Read existing watchlist
    with open(json_file, 'r') as f:
        watchlist = json.load(f)

    for wl in watchlist:
        if wl['movie'] == MovieID:
            if wl['like'] == False:
                return jsonify({'success': True, 'message': 'Movie already disliked'}), 400
            else:
                wl['like'] = False
                return jsonify({'success': True}), 400

    # Create new user object
    new_movie_to_watchlist = {
        "email": session['LoggedIn'],
        "movie": MovieID,
        "like": False
    }

    # Append to list
    watchlist.append(new_movie_to_watchlist)

    # Write the updated list back to the file
    with open(json_file, 'w') as f:
        json.dump(watchlist, f, indent=4)

    return jsonify({'success': True}), 200

@movie.route('/api/movie/get/dislikes', methods=['GET', 'POST'])
def get_dislikes():
    try:
        json_file = 'likeAndDislike.json'

        # Return empty list if file doesn't exist
        if not os.path.exists(json_file):
            return jsonify([])

        with open(json_file, 'r') as f:
            all_likes_data = json.load(f)

        # Filter for user's disliked movies
        user_dislikes = [
            item for item in all_likes_data
            if item['email'].lower() == session['LoggedIn'].lower() 
            and item.get('like') is False
        ]

        # Fetch OMDB data for each disliked movie
        movies_with_details = []
        for item in user_dislikes:
            url = f'https://www.omdbapi.com/?i={item["movie"]}&apikey={omdb_api_key}'
            response = requests.get(url)
            movie_data = response.json()
            movies_with_details.append(movie_data)

        return jsonify(movies_with_details)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@movie.route('/api/movie/get/dislikes/remove', methods=['GET', 'POST'])
def dislikes_remove():
    data = request.get_json()
    MovieID = data.get('imdbID')

    # JSON file path
    json_file = 'likeAndDislike.json'

    # If file doesn't exist or is empty, safely return since there's nothing to remove
    if not os.path.exists(json_file):
        return jsonify({'success': False, 'message': 'Watchlist not found'}), 400

    # Load existing watchlist from JSON
    with open(json_file, 'r') as f:
        watchlist = json.load(f)

    # Filter out the item that matches both the logged in user's email and the MovieID
    updated_watchlist = [
        item for item in watchlist
        if not (item['email'].lower() == session['LoggedIn'].lower() and item['movie'] == MovieID)
    ]

    # Write the updated list back to the file
    with open(json_file, 'w') as f:
        json.dump(updated_watchlist, f, indent=4)

    return jsonify({'success': True}), 200