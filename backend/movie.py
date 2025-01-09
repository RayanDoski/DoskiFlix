from flask import Blueprint, jsonify, request, session 
import requests
import json, os
from API_KEY import omdb_api_key

# Create the blueprint
movie = Blueprint('movie', __name__)

from flask import Blueprint, jsonify, request, session 
import requests
import json, os
from API_KEY import omdb_api_key

# Create the blueprint
movie = Blueprint('movie', __name__)

# Watchlist Routes
@movie.route('/api/watchlist', methods=['GET'])
def get_watchlist():
    try:
        with open('watchlist.json', 'r') as f:
            watchlist_data = json.load(f)

        user_watchlist = [item for item in watchlist_data if item['email'].lower() == session['LoggedIn'].lower()]

        movies_with_details = []
        for item in user_watchlist:
            url = f'https://www.omdbapi.com/?i={item["movie"]}&apikey={omdb_api_key}'
            response = requests.get(url)
            movie_data = response.json()
            movies_with_details.append(movie_data)

        return jsonify(movies_with_details)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@movie.route('/api/watchlist', methods=['POST'])
def add_to_watchlist():
    data = request.get_json()
    MovieID = data.get('imdbID')

    json_file = 'watchlist.json'

    if not os.path.exists(json_file):
        with open(json_file, 'w') as f:
            json.dump([], f)

    with open(json_file, 'r') as f:
        watchlist = json.load(f)

    new_movie = {
        "email": session['LoggedIn'],
        "movie": MovieID
    }

    watchlist.append(new_movie)

    with open(json_file, 'w') as f:
        json.dump(watchlist, f, indent=4)

    return jsonify({'success': True}), 201

@movie.route('/api/watchlist/<movie_id>', methods=['DELETE'])
def remove_from_watchlist(movie_id):

    json_file = 'watchlist.json'

    if not os.path.exists(json_file):
        return jsonify({'error': 'Watchlist not found'}), 404

    with open(json_file, 'r') as f:
        watchlist = json.load(f)

    updated_watchlist = [
        item for item in watchlist
        if not (item['email'].lower() == session['LoggedIn'].lower() and item['movie'] == movie_id)
    ]

    with open(json_file, 'w') as f:
        json.dump(updated_watchlist, f, indent=4)

    return '', 204

# Likes Routes
@movie.route('/api/likes', methods=['GET'])
def get_likes():
    try:
        json_file = 'likeAndDislike.json'

        if not os.path.exists(json_file):
            return jsonify([])

        with open(json_file, 'r') as f:
            all_likes_data = json.load(f)

        user_likes = [
            item for item in all_likes_data
            if item['email'].lower() == session['LoggedIn'].lower() 
            and item.get('like') is True
        ]

        movies_with_details = []
        for item in user_likes:
            url = f'https://www.omdbapi.com/?i={item["movie"]}&apikey={omdb_api_key}'
            response = requests.get(url)
            movie_data = response.json()
            movie_data['like'] = item['like']
            movies_with_details.append(movie_data)

        return jsonify(movies_with_details)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@movie.route('/api/likes', methods=['POST'])
def add_like():
    data = request.get_json()
    MovieID = data.get('imdbID')

    json_file = 'likeAndDislike.json'

    if not os.path.exists(json_file):
        with open(json_file, 'w') as f:
            json.dump([], f)

    with open(json_file, 'r') as f:
        likes = json.load(f)

    for item in likes:
        if item['movie'] == MovieID:
            if item['like'] is True:
                return jsonify({'error': 'Movie already liked'}), 409
            item['like'] = True
            with open(json_file, 'w') as f:
                json.dump(likes, f, indent=4)
            return jsonify({'success': True}), 200

    new_like = {
        "email": session['LoggedIn'],
        "movie": MovieID,
        "like": True
    }

    likes.append(new_like)

    with open(json_file, 'w') as f:
        json.dump(likes, f, indent=4)

    return jsonify({'success': True}), 201

@movie.route('/api/likes/<movie_id>', methods=['DELETE'])
def remove_like(movie_id):

    json_file = 'likeAndDislike.json'

    if not os.path.exists(json_file):
        return jsonify({'error': 'Likes not found'}), 404

    with open(json_file, 'r') as f:
        likes = json.load(f)

    updated_likes = [
        item for item in likes
        if not (item['email'].lower() == session['LoggedIn'].lower() and item['movie'] == movie_id)
    ]

    with open(json_file, 'w') as f:
        json.dump(updated_likes, f, indent=4)

    return '', 204

# Dislikes Routes
@movie.route('/api/dislikes', methods=['GET'])
def get_dislikes():
    try:
        json_file = 'likeAndDislike.json'

        if not os.path.exists(json_file):
            return jsonify([])

        with open(json_file, 'r') as f:
            all_likes_data = json.load(f)

        user_dislikes = [
            item for item in all_likes_data
            if item['email'].lower() == session['LoggedIn'].lower() 
            and item.get('like') is False
        ]

        movies_with_details = []
        for item in user_dislikes:
            url = f'https://www.omdbapi.com/?i={item["movie"]}&apikey={omdb_api_key}'
            response = requests.get(url)
            movie_data = response.json()
            movies_with_details.append(movie_data)

        return jsonify(movies_with_details)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@movie.route('/api/dislikes', methods=['POST'])
def add_dislike():
    data = request.get_json()
    MovieID = data.get('imdbID')

    json_file = 'likeAndDislike.json'

    if not os.path.exists(json_file):
        with open(json_file, 'w') as f:
            json.dump([], f)

    with open(json_file, 'r') as f:
        dislikes = json.load(f)

    for item in dislikes:
        if item['movie'] == MovieID:
            if item['like'] is False:
                return jsonify({'error': 'Movie already disliked'}), 409
            item['like'] = False
            with open(json_file, 'w') as f:
                json.dump(dislikes, f, indent=4)
            return jsonify({'success': True}), 200

    new_dislike = {
        "email": session['LoggedIn'],
        "movie": MovieID,
        "like": False
    }

    dislikes.append(new_dislike)

    with open(json_file, 'w') as f:
        json.dump(dislikes, f, indent=4)

    return jsonify({'success': True}), 201

@movie.route('/api/dislikes/<movie_id>', methods=['DELETE'])
def remove_dislike(movie_id):

    json_file = 'likeAndDislike.json'

    if not os.path.exists(json_file):
        return jsonify({'error': 'Dislikes not found'}), 404

    with open(json_file, 'r') as f:
        dislikes = json.load(f)

    updated_dislikes = [
        item for item in dislikes
        if not (item['email'].lower() == session['LoggedIn'].lower() and item['movie'] == movie_id)
    ]

    with open(json_file, 'w') as f:
        json.dump(updated_dislikes, f, indent=4)

    return '', 204