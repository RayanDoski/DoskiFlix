import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './popupMessage.css';

function Message({ message }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  
  if (!visible) return null;

  return (
    <div className='messagePopupBackground'>
      <div className="message">
        <p>{message}</p>
      </div>
    </div>
  );
}

export default Message;