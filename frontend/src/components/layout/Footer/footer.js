import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import'./footer.css';
function Footer() {

 
  return (
    /* <>

     <div>FOOOOTER</div>

    </>*/
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <h4>Om oss</h4>
          <p>Det här är en hemsida för att visa filmer och TV-program.</p>
        </div>

        <div className="footer-bottom">
          <h4>Snabblänkar</h4>
          <ul className="footer-links">
            <li><Link to="/tv-shows">TV-program</Link></li>
            <li><Link to="/movies">Filmer</Link></li>
            <li><Link to="/latest">Senaste</Link></li>
            <li><Link to="/my-list">Min lista</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Kontakt</h4>
          <p>Email: kontakt@hemsida.se</p>
          <p>Telefon: +46 123 456 789</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 DoskiFilx Hemsida. Alla rättigheter förbehållna.</p>
      </div>
    </footer>
  );
}

export default Footer;
