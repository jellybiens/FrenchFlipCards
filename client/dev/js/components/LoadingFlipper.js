import React from 'react';

const LoadingFlipper = () => (
  <div className="loading-flipper">
    <div className="flip-container">
      <div className="flipper">
        <div className="front"><span>LOADING</span></div>
        <div className="back"><span>CHARGEMENT</span></div>
      </div>
    </div>
  </div>
);

export default LoadingFlipper;
