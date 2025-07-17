import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './header.css';
import hamburger from '../../../assets/images/hamburger-menu.png';
import LoginCheck from '../../functionality/LoginCheck.js';
import Login from '../../pages/popupLogin.js'

function Header() {

  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [userInfo, setUserInfo] = useState([]);
  const { isLoggedIn, isLoading } = LoginCheck();
  const apiUrl = process.env.REACT_APP_API_URL;

  const toggleSlideMenu = () => {
    setIsOpen(!isOpen);
  }

  // For profile
  const getUserInfo = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/users/current`, {
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

  // get the info
  useEffect(() => {
    getUserInfo()
  }, []);

  return (
    <>

      {showLogin && <Login/>}

      <header>
        <aside>
          <div>
            <h1><Link className='logo' to="/">DoskiFlix</Link></h1>
            <ul>
              <Link className='link' to="/"><li>Home</li></Link>
              <Link className='link' to="/#Comedy"><li>Comedy</li></Link>
              <Link className='link' to="/#Action"><li>Action</li></Link>
              <Link className='link' to="/#Drama"><li>Drama</li></Link>
              <Link className='link' to="/#SciFi"><li>SciFi</li></Link>
            </ul>
          </div>
          
          { isLoggedIn ? (
            <div>
              <Link className='profile' to="/profile">
                <img src={`/profile_img/${userInfo.profileImg}`} alt="Profile-picture" />
              </Link>
              <Link className='hamburger' to="/profile">
                <img src={hamburger} alt="hamburger-image" onClick={toggleSlideMenu} />
              </Link>
            </div>
          ) : (
            <div>
              <aside>
                <button className='login' onClick={() => setShowLogin(true)}>Join Doskiflix</button>
              </aside>
            </div>
          )}
          
        </aside>
      </header>

      <div className={ isOpen ? 'slide-menu-background' : 'slide-menu-background-close' } onClick={toggleSlideMenu}></div>
      <div className={ isOpen ? 'slide-menu' : 'slide-menu-close' }>
        <h2>Menu</h2>
        <ul>
          <Link className='link' to="/">Home</Link>
          <div className='divider'></div>
          <Link className='link' to="/tv-shows">TV Shows</Link>
          <div className='divider'></div>
          <Link className='link' to="/movies">Movies</Link>
          <div className='divider'></div>
          <Link className='link' to="/latest">Latest</Link>
          <div className='divider'></div>
          <Link className='link' to="/my-list">My List</Link>
        </ul>
      </div>

    </>
  );
}

export default Header;