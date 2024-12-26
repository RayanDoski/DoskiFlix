import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '../../assets/styles/profilepage.css';

// functionality
import handleMovieLikeClick from '../functionality/like.js'
import handleMovieDislikeClick from '../functionality/dislike.js'

function ProfilePage() {

    // This will hold the full info about each movie (not just the IMDb ID).
    const [movies, setMovies] = useState([]);
    const [likedMovies, setLikedMovies] = useState([]);
    const [dislikedMovies, setDislikedMovies] = useState([]);
    const [userInfo, setUserInfo] = useState([]);

    // 1) Define the function in top-level component scope
    const fetchWatchlistAndMovies = async () => {
        try {
        const watchlistResponse = await fetch('http://127.0.0.1:8000/api/movie/get/watchlist', {
            method: 'POST',
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json',
            },
        });
        const watchlistData = await watchlistResponse.json();

        const movieDetailsPromises = watchlistData.map(async (item) => {
            const omdbResp = await fetch(
            `https://www.omdbapi.com/?i=${item.movie}&apikey=72ced4bc`
            );
            const omdbData = await omdbResp.json();
            return {
            ...omdbData,
            };
        });

        const fullMovieDetails = await Promise.all(movieDetailsPromises);
        setMovies(fullMovieDetails);

        } catch (error) {
        console.error('Error:', error);
        }
    };

    const fetchLikedMovies = async () => {
        try {
        const LikedMoviesResponse = await fetch('http://127.0.0.1:8000/api/movie/get/likes', {
            method: 'POST',
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json',
            },
        });
        const LikedMoviesData = await LikedMoviesResponse.json();

        const movieDetailsPromises = LikedMoviesData.map(async (item) => {
            const omdbResp = await fetch(
            `https://www.omdbapi.com/?i=${item.movie}&apikey=72ced4bc`
            );
            const omdbData = await omdbResp.json();
            return {
            ...omdbData,
            like: item.like
            };
        });

        const fullMovieDetails = await Promise.all(movieDetailsPromises);
        setLikedMovies(fullMovieDetails);

        } catch (error) {
        console.error('Error:', error);
        }
    };

    const fetchDislikedMovies = async () => {
        try {
        const DislikedMoviesResponse = await fetch('http://127.0.0.1:8000/api/movie/get/dislikes', {
            method: 'POST',
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json',
            },
        });
        const DislikedMoviesData = await DislikedMoviesResponse.json();

        const movieDetailsPromises = DislikedMoviesData.map(async (item) => {
            const omdbResp = await fetch(
            `https://www.omdbapi.com/?i=${item.movie}&apikey=72ced4bc`
            );
            const omdbData = await omdbResp.json();
            return {
            ...omdbData,
            // like: !item.like
            };
        });

        const fullMovieDetails = await Promise.all(movieDetailsPromises);
        setDislikedMovies(fullMovieDetails);

        } catch (error) {
        console.error('Error:', error);
        }
    }

    // 2) Use `useEffect` to call it on mount
    useEffect(() => {
        fetchWatchlistAndMovies();
        fetchDislikedMovies();
        fetchLikedMovies();
        getUserInfo()
    }, []);


    const handleWatchlistRemove = async (imdbID) => {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/movie/get/watchlist/remove', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imdbID }), // pass imdbID in the request body
          });
          
          const data = await response.json();
      
          if (data.success) {
            fetchWatchlistAndMovies()
          }
      
        } catch (error) {
          console.error('Error adding movie to watchlist:', error);
        }
    };

    const handleLikedMovieRemove = async (imdbID) => {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/movie/get/dislikes/remove', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imdbID }), // pass imdbID in the request body
          });
          
          const data = await response.json();
      
          if (data.success) {
            fetchLikedMovies()
          }
      
        } catch (error) {
          console.error('error', error);
        }
    };

    const handleDislikedMovieRemove = async (imdbID) => {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/movie/get/dislikes/remove', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imdbID }), // pass imdbID in the request body
          });
          
          const data = await response.json();
      
          if (data.success) {
            fetchDislikedMovies()
          }
      
        } catch (error) {
          console.error('error', error);
        }
    };

    // For profile
    const getUserInfo = async (imdbID) => {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/get/user/info', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          const data = await response.json();
      
          if (data.success) {
            setUserInfo(data.info)
          }
      
        } catch (error) {
          console.error('error', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://127.0.0.1:8000/api/update/user/info", {
                method: "POST",
                credentials: 'include',
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    firstname: userInfo.firstname,
                    lastname: userInfo.lastname,
                    email: userInfo.email,
                }),
            });

            const data = await response.json();

            if (data.success) {
                getUserInfo()
            }

        } catch (error) {
            console.error("Error:", error);
        }
    };
    
    return (
        <div id="wrapper">
            <div id="profileDesign">
                <div className="profile-card">
                    <img src={`../../assets/images/${userInfo.profileImg}`} alt="Profile Photo" className="profile-image" />
                    <h2 className="profile-title">{userInfo.firstname} {userInfo.lastname} {userInfo.profileImg}</h2>

                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={userInfo.firstname}
                            placeholder="Firstname"
                            onChange={(e) =>
                            setUserInfo({ ...userInfo, firstname: e.target.value })
                            }
                        />
                        <input
                            type="text"
                            value={userInfo.lastname}
                            placeholder="Lastname"
                            onChange={(e) =>
                            setUserInfo({ ...userInfo, lastname: e.target.value })
                            }
                        />
                        <input
                            type="email"
                            value={userInfo.email}
                            placeholder="Email"
                            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                        />

                        {/* File Input */}
                        <input
                            type="file"
                            id="profileImgFile"
                            className="profileImg-file"
                        />
                        <label htmlFor="profileImgFile" className="profileImg-label">
                            Upload Photo
                        </label>

                        <button type="submit">Save</button>
                    </form>
                </div>
            </div>

            <div id="stackedColumns">
                <div className="column" id="likedDesign">
                    <h3>Liked</h3>
                    <ul>
                        {likedMovies.map((movie, index) => (
                            <li key={index}>
                                <img src={movie.Poster} alt={`${movie.Title} Poster`} style={{ width: '100px' }}/>
                                <aside>
                                    <div>
                                        <h4>{movie.Title}</h4>
                                        <p>Rating: {movie.imdbRating}/10</p>
                                        <p>Year: {movie.Year}</p>
                                    </div>
                                    <p onClick={() => handleLikedMovieRemove(movie.imdbID)}>&#128465;</p>
                                </aside>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="column" id="dislikedDesign">
                    <h3>Disliked</h3>
                    <ul>
                        {dislikedMovies.map((movie, index) => (
                            <li key={index}>
                                <img src={movie.Poster} alt={`${movie.Title} Poster`} style={{ width: '100px' }}/>
                                <aside>
                                    <div>
                                        <h4>{movie.Title}</h4>
                                        <p>Rating: {movie.imdbRating}/10</p>
                                        <p>Year: {movie.Year}</p>
                                    </div>
                                    <p onClick={() => handleDislikedMovieRemove(movie.imdbID)}>&#128465;</p>
                                </aside>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="column" id="watchlistDesign">
                    <h3>Full Watchlist</h3>
                    <ul>
                        {movies.map((movie, index) => (
                            <li key={index}>
                                <img src={movie.Poster} alt={`${movie.Title} Poster`} style={{ width: '100px' }}/>
                                <aside>
                                    <div>
                                        <h4>{movie.Title}</h4>
                                        <p>Rating: {movie.imdbRating}/10</p>
                                        <p>Year: {movie.Year}</p>
                                        <article>
                                            <button className='likeBtn' onClick={async () => { await handleMovieLikeClick(movie.imdbID); fetchLikedMovies(); }}>Like</button>
                                            <button className='dislikeBtn' onClick={async () => { await handleMovieDislikeClick(movie.imdbID); fetchDislikedMovies(); }}>Dislike</button>
                                        </article>
                                    </div>
                                    <p onClick={() => handleWatchlistRemove(movie.imdbID)}>&#128465;</p>
                                </aside>
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
        </div>
    );
}

export default ProfilePage;

