import React, { useEffect, useState } from 'react';

function LoginCheck() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/isloggedin', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        setIsLoggedIn(data.success);

      } catch (error) {
        console.error('Error checking login status', error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  return isLoggedIn

}

export default LoginCheck;
