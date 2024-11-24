import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './header.css';
import hamburger from '../../../assets/images/hamburger-menu.png';

function Header() {

  const [isOpen, setIsOpen] = useState(false);

  const toggleSlideMenu = () => {
    setIsOpen(!isOpen);
  }

  return (
    <>

      <header>
        <aside>
          <div>
            <h1><Link className='logo' to="/">DoskiFlix</Link></h1>
            <ul>
              <Link className='link' to="/ddd"><li>Home</li></Link>
              <Link className='link' to="/tv-shows"><li>TV Shows</li></Link>
              <Link className='link' to="/movies"><li>Movies</li></Link>
              <Link className='link' to="/latest"><li>Latest</li></Link>
              <Link className='link' to="/my-list"><li>My List</li></Link>
            </ul>
          </div>
          

          <div>
            <Link className='profile' to="/profile">
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" alt="Profile-picture" />
            </Link>
            <Link className='hamburger' to="/profile">
              <img src={hamburger} alt="hamburger-image" onClick={toggleSlideMenu} />
            </Link>
          </div>
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