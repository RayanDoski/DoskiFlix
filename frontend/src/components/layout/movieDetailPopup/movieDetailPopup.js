import React, { useState, useEffect } from 'react';
import { Form, Link } from 'react-router-dom';
import './movieDetailPopup.css';
import Loading from '../Loading/loading.js';
import LoginCheck from '../../functionality/LoginCheck.js';
import Message from '../popupMessage/popupMessage.js';
import getAPIKey from '../../functionality/apikey.js';

// functionality
import handleMovieLikeClick from '../../functionality/like.js'
import handleMovieDislikeClick from '../../functionality/dislike.js'

function MovieDetailPopup({ data, onClose }) {

  const [movieData, setMovieData] = useState({});
  const [showLoading, setShowLoading] = useState(false)
  const [showMessage, setShowMessage] = useState(false);
  const [showLikeMessage, setShowLikeMessage] = useState(false);
  const [showDislikeMessage, setShowDislikeMessage] = useState(false);
  const { isLoggedIn, isLoading } = LoginCheck();

  const generateMovie = async () => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/omdb_movie', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data }),
        });
        
        const result = await response.json();
        
        if (result.success) {
          setMovieData(result.data)
        }
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
  };


  useEffect(() => {
    generateMovie()
  });

  const handleWatchlistClick = async (imdbID) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/watchlist', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imdbID }), // pass imdbID in the request body
      });

      const data = await response.json();

      if (data.m) {
        alert(data.m)
      }
      } catch (error) {
        console.error('Error adding movie to watchlist:', error);
    }
  }

  const handleLikeWithMessage = async (imdbID) => {
    const success = await handleMovieLikeClick(imdbID);
    if (success) {
      setShowLikeMessage(true);
      setTimeout(() => {
        setShowLikeMessage(false);
      }, 2100);
    }
  };

  const handleDislikeWithMessage = async (imdbID) => {
    const success = await handleMovieDislikeClick(imdbID);
    if (success) {
      setShowDislikeMessage(true);
      setTimeout(() => {
        setShowDislikeMessage(false);
      }, 2100);
    }
  };



  return (
    <>
      {showLoading && <Loading />}
      <section className='viewMoviePopupBackground' onClick={onClose}></section>
      <section className='viewMoviePopup'>
        <img src={movieData.Poster} alt={movieData.Title} />
        <div>
          <h2>{movieData.Title}</h2>
          <p className='rating'>Rating {movieData.imdbRating}/10</p>
          <p>{movieData.Plot}</p>
          {isLoggedIn && (
            <div>
              <button className='watchlist' onClick={() => handleWatchlistClick(movieData.imdbID)}>
                Add To Watchlist &#43;
              </button>
              <button className='likeBtn' onClick={() => handleLikeWithMessage(movieData.imdbID)}>
                Like
              </button>
              <button className='dislikeBtn' onClick={() => handleDislikeWithMessage(movieData.imdbID)}>
                Dislike
              </button>
            </div>
          )}
        </div>
      </section>
      {showMessage && <Message message="Added" />}
      {showLikeMessage && <Message message="Liked" />}
      {showDislikeMessage && <Message message="Disliked" />}
    </>
  );
}

export default MovieDetailPopup;