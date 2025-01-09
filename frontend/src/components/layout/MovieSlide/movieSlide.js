import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './movieSlide.css';
import Loading from '../Loading/loading.js';
import MovieDetailPopup from '../movieDetailPopup/movieDetailPopup.js';

 
function MovieCarousel({ Title, movies, category }) {
  const [moviesData, setMoviesData] = useState([]);
  const [showMovieDetails, setShowMovieDetails] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateMovies = async () => {
    try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:8000/api/omdb_batch', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ movies }),
        });
        
        const result = await response.json();
        
        if (result.success) {
            setMoviesData(result.data);
            setLoading(false);
        }
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
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

    const handleMovieClick = (movie) => {
      setSelectedMovie(movie);
      setShowMovieDetails(true);
    };
  
    const handleClosePopup = () => {
      setShowMovieDetails(false);
      setSelectedMovie(null);
    };
  
    return (
      <>
      {loading && <Loading />}
      {showMovieDetails && selectedMovie && (
        <MovieDetailPopup 
          data={selectedMovie} 
          onClose={handleClosePopup}
        />
      )}
      <div className="movie-carousel" id={category}>
        <h2>{Title}</h2>
        <div className="carousel-container">
          <button className="scroll-button left" onClick={scrollLeft}>
            &#8249; {/* Left arrow */}
          </button>
          <div className="carousel" ref={carouselRef}>
          {moviesData.map((movie) => (
            <div className="movie" key={movie.imdbID} onClick={() => handleMovieClick(movie.Title)}>
              <img
                src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/200x300'}
                alt={movie.Title}
              />
              <p>{movie.Title}</p>
            </div>
          ))}
          </div>
          <button className="scroll-button right" onClick={scrollRight}>
            &#8250; {/* Right arrow */}
          </button>
        </div>
      </div>
      </>
    );
  };
  
  export default MovieCarousel;