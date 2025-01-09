import React, { useState, useEffect } from 'react';
import { Form, Link } from 'react-router-dom';
import './hero.css';
import Loading from '../Loading/loading.js';
import LoginCheck from '../../functionality/LoginCheck.js';
import Message from '../popupMessage/popupMessage.js';

// functionality
import handleMovieLikeClick from '../../functionality/like.js'
import handleMovieDislikeClick from '../../functionality/dislike.js'

function HeroSection() {

  const [movieData, setMovieData] = useState({});
  const [showLoading, setShowLoading] = useState(false)
  const [showMessage, setShowMessage] = useState(false);
  const [showLikeMessage, setShowLikeMessage] = useState(false);
  const [showDislikeMessage, setShowDislikeMessage] = useState(false);
  const { isLoggedIn, isLoading } = LoginCheck();

  const generateRandomMovie = async () => {
    try {
      setShowLoading(true);
      const response = await fetch('http://127.0.0.1:8000/api/omdb_info', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
  
      // handle response data here if needed

      if (data.success) {
        setMovieData(data.data);
        setShowLoading(false);
      }
  
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    generateRandomMovie();
  }, []);

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
        { showLoading ? <Loading/> : ''}
        {showMessage && <Message message='Added' />}
        {showLikeMessage && <Message message='Liked!' />}
        {showDislikeMessage && <Message message='Disliked!' />}
        <section className='heroSection'>
            <button onClick={generateRandomMovie}>Generate Random</button>
            <img src={movieData["Poster"]} alt="Hero Image" />
            <div>
                <h2>{movieData["Title"]}</h2>
                <p className='rating'>Rating {movieData["imdbRating"]}/10</p>
                <p>{movieData["Plot"]}</p>
                { isLoggedIn ? (
                <div>
                    <button className='watchlist' onClick={() => handleWatchlistClick(movieData["imdbID"])}>Add To Watchlist &#43;</button>
                    <button className='likeBtn' onClick={() => handleLikeWithMessage(movieData["imdbID"])}>Like</button>
                    <button className='dislikeBtn' onClick={() => handleDislikeWithMessage(movieData["imdbID"])}>Dislike</button>
                </div>
                ) : (<div></div>)
              }
            </div>
        </section>
    </>
  );
}

export default HeroSection;