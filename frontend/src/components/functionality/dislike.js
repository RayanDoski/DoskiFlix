const handleMovieDislikeClick = async (imdbID) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    try {
      const response = await fetch(`${apiUrl}/api/dislikes`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imdbID }), // pass imdbID in the request body
      });
      
      const data = await response.json();
  
      // handle response data here if needed

      if (data.m) {
        alert(data.m)
      }

      return true;
  
    } catch (error) {
      console.error('Error adding movie to watchlist:', error);
    }
  };

export default handleMovieDislikeClick;