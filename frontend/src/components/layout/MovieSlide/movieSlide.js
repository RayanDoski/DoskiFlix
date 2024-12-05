import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './movieSlide.css';
import Loading from '../Loading/loading.js';

  function MovieCarousel({ Title, movies })  {

    const [moviesData, setMoviesData] = useState([]); // Initialize as an array

    const generateMovies = () => {
        const randomTitles = Array.from(
        { length: 13 },
        () => movies[Math.floor(Math.random() * movies.length)]
        );
        Promise.all(
        randomTitles.map((title) =>
            fetch(`https://www.omdbapi.com/?t=${title}&apikey=72ced4bc`)
        )
        )
        .then((responses) => Promise.all(responses.map((response) => response.json())))
        .then((dataArray) => {
            setMoviesData(dataArray);
        });
    };

    useEffect(() => {
        generateMovies();
    }, []);

    const carouselRef = useRef(null);
  
    const scrollLeft = () => {
      carouselRef.current.scrollBy({
        left: -300, // Adjust scroll amount
        behavior: 'smooth',
      });
    };
  
    const scrollRight = () => {
      carouselRef.current.scrollBy({
        left: 300, // Adjust scroll amount
        behavior: 'smooth',
      });
    };
  
    return (
      <div className="movie-carousel">
        <h2>{Title}</h2>
        <div className="carousel-container">
          <button className="scroll-button left" onClick={scrollLeft}>
            &#8249; {/* Left arrow */}
          </button>
          <div className="carousel" ref={carouselRef}>
          {moviesData.map((movie) => (
            <Link to={`/details/${movie.imdbID}`} className="movie" key={movie.imdbID}>
              <img
                src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/200x300'}
                alt={movie.Title}
              />
              <p>{movie.Title}</p>
            </Link>
          ))}
          </div>
          <button className="scroll-button right" onClick={scrollRight}>
            &#8250; {/* Right arrow */}
          </button>
        </div>
      </div>
    );
  };
  
  export default MovieCarousel;