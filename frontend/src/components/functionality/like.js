const handleMovieLikeClick = async (imdbID) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/movie/like/add', {
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
  
    } catch (error) {
      console.error('Error adding movie to watchlist:', error);
    }
  };

export default handleMovieLikeClick;