import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './hero.css';
import Loading from '../Loading/loading.js';
import LoginCheck from '../LoginCheck/LoginCheck.js';

function HeroSection() {

  const [movieData, setMovieData] = useState({});
  const [showLoading, setShowLoading] = useState(false)

  const movies = [
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
  ];

  const generateRandomMovie = () => {
    setShowLoading(true)
    const randomTitle = movies[Math.floor(Math.random() * movies.length)];
    fetch(`https://www.omdbapi.com/?t=${randomTitle}&apikey=72ced4bc`)
      .then(response => response.json())
      .then(data => {
        setMovieData(data);
        setShowLoading(false);
    });
  };

  useEffect(() => {
    generateRandomMovie();
  }, []);

  return (
    <>
        { showLoading ? <Loading/> : ''}
        <section className='heroSection'>
            <button onClick={generateRandomMovie}>Generate Random</button>
            <img src={movieData["Poster"]} alt="Hero Image" />
            <div>
                <h2>{movieData["Title"]}</h2>
                <p className='rating'>Rating {movieData["imdbRating"]}/10</p>
                <p>{movieData["Plot"]}</p>
                <Link className='viewMoreBtn' to={`/details/${movieData["imdbID"]}`}>View More</Link>
                { LoginCheck() ? (
                <div>
                    <button className='watchlist' >Add To Watchlist &#43;</button>
                    <button className='likeBtn' >Like</button>
                    <button className='dislikeBtn' >Dislike</button>
                </div>
                ) : (<div></div>)
              }
            </div>
        </section>
    </>
  );
}

export default HeroSection;