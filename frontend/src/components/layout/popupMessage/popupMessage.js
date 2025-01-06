import React, { useState, useEffect } from 'react';
import './popupMessage.css';

function Message({ message }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2000);

    // Just clear the timeout, don't set visible back to true here
    return () => clearTimeout(timer);
  }, [message]); // Add message as a dependency
  
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