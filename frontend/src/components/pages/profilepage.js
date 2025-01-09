import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '../../assets/styles/profilepage.css';
import Loading from '../layout/Loading/loading.js';
import LoginCheck from '../functionality/LoginCheck.js';
import Message from '../layout/popupMessage/popupMessage.js';

// functionality
import handleMovieLikeClick from '../functionality/like.js'
import handleMovieDislikeClick from '../functionality/dislike.js'

function ProfilePage() {

    // This will hold the full info about each movie (not just the IMDb ID).
    const [movies, setMovies] = useState([]);
    const [likedMovies, setLikedMovies] = useState([]);
    const [dislikedMovies, setDislikedMovies] = useState([]);
    const [movieTips, setMovieTips] = useState([]);
    const [userInfo, setUserInfo] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showLoading, setShowLoading] = useState(false)
    const { isLoggedIn, isLoading } = LoginCheck();

    // for showing like and dislike messages
    const [showLikeMessage, setShowLikeMessage] = useState(false);
    const [showDislikeMessage, setShowDislikeMessage] = useState(false);

    const fetchWatchlistAndMovies = async () => {
      try {
          const response = await fetch('http://127.0.0.1:8000/api/watchlist', {
              method: 'GET',
              credentials: 'include',
              headers: {
                  'Content-Type': 'application/json',
              },
          });
          
          const movieData = await response.json();
          setMovies(movieData);
  
      } catch (error) {
          console.error('Error:', error);
      }
    };

    const fetchLikedMovies = async () => {
      try {
          const response = await fetch('http://127.0.0.1:8000/api/likes', {
              method: 'GET',
              credentials: 'include',
              headers: {
                  'Content-Type': 'application/json',
              },
          });
          
          const movieData = await response.json();
          setLikedMovies(movieData);
  
      } catch (error) {
          console.error('Error:', error);
      }
    };

    const fetchDislikedMovies = async () => {
      try {
          const response = await fetch('http://127.0.0.1:8000/api/dislikes', {
              method: 'GET',
              credentials: 'include',
              headers: {
                  'Content-Type': 'application/json',
              },
          });
          
          const movieData = await response.json();
          setDislikedMovies(movieData);
  
      } catch (error) {
          console.error('Error:', error);
      }
    };

    useEffect(() => {
      if (isLoading) return;
      
      if (!isLoggedIn) {
          window.location.href = '/';
          return;
      }

      const initializeData = async () => {
          await fetchWatchlistAndMovies();
          await fetchDislikedMovies();
          await fetchLikedMovies();
          await getUserInfo();
          setShowLoading(false);
      };

      initializeData();
  }, [isLoggedIn, isLoading]);


    const handleWatchlistRemove = async (imdbID) => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/watchlist/${imdbID}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            }
          });
                
          fetchWatchlistAndMovies()
      
        } catch (error) {
          console.error('Error adding movie to watchlist:', error);
        }
    };

    const handleLikedMovieRemove = async (imdbID) => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/likes/${imdbID}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
      
          fetchLikedMovies()
      
        } catch (error) {
          console.error('error', error);
        }
    };

    const handleDislikedMovieRemove = async (imdbID) => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/dislikes/${imdbID}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
      
          fetchDislikedMovies()
      
        } catch (error) {
          console.error('error', error);
        }
    };

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

    // For profile
    const getUserInfo = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/users/current', {
            method: 'GET',
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

    const logoutUser = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/session', {
            method: 'DELETE',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const data = await response.json();

          if (data.success) {
            window.location.reload();
          }

        } catch (error) {
          console.error('error', error);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        
        // Generate unique filename
        const timestamp = Date.now();
        const uniqueFileName = `${timestamp}_${file.name}`;
        
        // Update userInfo with new filename
        setUserInfo(prev => ({
          ...prev,
          profileImg: uniqueFileName
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          // First, upload the file if one is selected
          if (selectedFile) {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("filename", userInfo.profileImg);
    
            const uploadResponse = await fetch("http://127.0.0.1:8000/api/users/current/avatar", {
              method: "PUT",
              credentials: 'include',
              body: formData
            });
    
            if (!uploadResponse.ok) {
              throw new Error('Failed to upload image');
            }
          }
    
          // Then update other user info
          const response = await fetch("http://127.0.0.1:8000/api/users/current", {
            method: "PUT",
            credentials: 'include',
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firstname: userInfo.firstname,
              lastname: userInfo.lastname,
              email: userInfo.email,
              profileImg: userInfo.profileImg
            }),
          });
    
          const data = await response.json();

          window.location.reload();

        } catch (error) {
          console.error("Error:", error);
        }
    };

    const generateMovieTips = async () => {
      setShowLoading(true);
      try {
          const response = await fetch('http://127.0.0.1:8000/api/generate_movie_ideas', {
              method: 'POST',
              credentials: 'include',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ likedMovies, dislikedMovies }),
          });
  
          const data = await response.json();
  
          if (data.success) {
              setMovieTips(data.movieTips);
          } else {
              console.log(data.error);
          }
      } catch (error) {
          console.error('Error:', error);
      } finally {
          setShowLoading(false);
      }
    };

    return (
        <>
        { showLoading ? <Loading/> : ''}
        {showLikeMessage && <Message message='Liked!' />}
        {showDislikeMessage && <Message message='Disliked!' />}
        <div id="wrapper">
            <div id="profileDesign">
                <div className="profile-card">
                    <img src={`/profile_img/${userInfo.profileImg}`} alt="Profile Photo" className="profile-image" />
                    <h2 className="profile-title">{userInfo.firstname} {userInfo.lastname}</h2>

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
                            onChange={handleFileChange}
                        />
                        <label htmlFor="profileImgFile" className="profileImg-label" >
                            Upload Photo
                        </label>

                        <button type="submit">Save</button>

                        <p onClick={() => logoutUser()}>Logout</p>
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
                                            <button className='likeBtn' onClick={async () => { await handleLikeWithMessage(movie.imdbID); fetchLikedMovies(); }}>Like</button>
                                            <button className='dislikeBtn' onClick={async () => { await handleDislikeWithMessage(movie.imdbID); fetchDislikedMovies(); }}>Dislike</button>
                                        </article>
                                    </div>
                                    <p onClick={() => handleWatchlistRemove(movie.imdbID)}>&#128465;</p>
                                </aside>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="column" id="watchlistDesign">
                <button className='GenerateMovieTipsBtn' onClick={() => generateMovieTips()}>
                    Generate Movie Tips
                </button>
                {movieTips.map((movie, index) => (
                    <div key={index} className="movie-card">
                        {movie.Poster && movie.Poster !== 'N/A' && (
                            <img src={movie.Poster} alt={movie.Title} />
                        )}
                        <div>
                            <h2>{movie.Title}</h2>
                            <p>Year: {movie.Year}</p>
                            <p>Director: {movie.Director}</p>
                            <p>Plot: {movie.Plot}</p>
                            <button className='watchlist' onClick={async () => { await handleWatchlistClick(movie.imdbID); fetchWatchlistAndMovies()}}>Add To Watchlist &#43;</button>
                        </div>

                    </div>
                ))}
            </div>

            </div>
        </div>
        </>
    );
}

export default ProfilePage;

