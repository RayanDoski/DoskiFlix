import { useEffect, useState } from 'react';

function useLoginCheck() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/session/status', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        setIsLoggedIn(data.authenticated);
      } catch (error) {
        console.error('Error checking login status', error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  return { isLoggedIn, isLoading };
}

export default useLoginCheck;