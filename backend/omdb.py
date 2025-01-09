from flask import Blueprint, jsonify, request, session
import requests, random
import json, os, hashlib
from API_KEY import omdb_api_key

# Create the blueprint
omdb = Blueprint('omdb', __name__)

movies = [
    "The Godfather",
    "The Shawshank Redemption",
    "Inception",
    "Forrest Gump",
    "The Dark Knight",
    "Titanic",
    "Pulp Fiction",
    "Schindler's List",
    "Fight Club",
    "The Matrix",
    "Interstellar",
    "The Lord of the Rings: The Fellowship of the Ring",
    "The Lord of the Rings: The Two Towers",
    "The Lord of the Rings: The Return of the King",
    "Star Wars: A New Hope",
    "Star Wars: The Empire Strikes Back",
    "Star Wars: Return of the Jedi",
    "Avatar",
    "Gladiator",
    "Saving Private Ryan",
    "The Avengers",
    "Iron Man",
    "Spider-Man: No Way Home",
    "Black Panther",
    "Jurassic Park",
    "The Lion King",
    "Toy Story",
    "Finding Nemo",
    "Inside Out",
    "Coco",
    "Frozen",
    "Beauty and the Beast",
    "Aladdin",
    "Moana",
    "The Little Mermaid",
    "Up",
    "WALL-E",
    "The Incredibles",
    "Harry Potter and the Sorcerer’s Stone",
    "Harry Potter and the Chamber of Secrets",
    "Harry Potter and the Prisoner of Azkaban",
    "Harry Potter and the Goblet of Fire",
    "Harry Potter and the Order of the Phoenix",
    "Harry Potter and the Half-Blood Prince",
    "Harry Potter and the Deathly Hallows: Part 1",
    "Harry Potter and the Deathly Hallows: Part 2",
    "The Hunger Games",
    "Catching Fire",
    "Mockingjay: Part 1",
    "Mockingjay: Part 2",
    "Twilight",
    "The Fault in Our Stars",
    "Divergent",
    "The Maze Runner",
    "Shrek",
    "Kung Fu Panda",
    "Madagascar",
    "How to Train Your Dragon",
    "Minions",
    "Despicable Me",
    "The Secret Life of Pets",
    "Zootopia",
    "Big Hero 6",
    "Monsters, Inc.",
    "Cars",
    "Ratatouille",
    "Tangled",
    "Brave",
    "A Bug's Life",
    "The Good Dinosaur",
    "Spider-Man",
    "Batman Begins",
    "The Dark Knight Rises",
    "Wonder Woman",
    "Aquaman",
    "Justice League",
    "Doctor Strange",
    "Thor: Ragnarok",
    "Captain Marvel",
    "Ant-Man",
    "Guardians of the Galaxy",
    "Deadpool",
    "Logan",
    "X-Men: Days of Future Past",
    "The Wolverine",
    "The Amazing Spider-Man",
    "The Lego Movie",
    "The Lego Batman Movie",
    "The Nightmare Before Christmas",
    "Coraline",
    "Spirited Away",
    "My Neighbor Totoro",
    "Princess Mononoke",
    "Howl’s Moving Castle",
    "Your Name",
    "Weathering With You",
    "Parasite",
    "Joker",
    "1917",
    "Knives Out"
]

@omdb.route('/api/omdb_movie', methods=['POST'])
def get_movie():
    try:

        data = request.get_json()
        title = data.get('data')

        # Make API request to OMDB
        url = f'https://www.omdbapi.com/?t={title}&apikey={omdb_api_key}'
        response = requests.get(url)
        movie_data = response.json()
        
        return jsonify({'success': True, 'data': movie_data})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@omdb.route('/api/omdb_info', methods=['POST'])
def generate_random_movie():
    try:
        # Get random movie title from list
        random_title = random.choice(movies)
        
        # Make API request to OMDB
        url = f'https://www.omdbapi.com/?t={random_title}&apikey={omdb_api_key}'
        response = requests.get(url)
        movie_data = response.json()
        
        return jsonify({'success': True, 'data': movie_data})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@omdb.route('/api/omdb_batch', methods=['POST'])
def generate_multiple_movies():
    try:
        # Get list of movie titles from request body
        movies = request.json.get('movies')

        # Shuffle and get 13 random movies
        selected_movies = random.sample(movies, 13)
        
        # Fetch data for all selected movies
        movie_data_list = []
        for title in selected_movies:
            url = f'https://www.omdbapi.com/?t={title}&apikey={omdb_api_key}'
            response = requests.get(url)
            movie_data = response.json()
            movie_data_list.append(movie_data)
        
        return jsonify({
            'success': True,
            'data': movie_data_list
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
