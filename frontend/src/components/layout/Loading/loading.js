import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './loading.css';

function LoadingScreen() {
  return (
    <div className='backgroundLoadingScreen'>
        <div class="middle">
            <div class="bar bar1"></div>
            <div class="bar bar2"></div>
            <div class="bar bar3"></div>
            <div class="bar bar4"></div>
            <div class="bar bar5"></div>
            <div class="bar bar6"></div>
            <div class="bar bar7"></div>
            <div class="bar bar8"></div>
        </div>
    </div>
  );
}

export default LoadingScreen;