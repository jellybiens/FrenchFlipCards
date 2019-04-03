import React, { Component } from 'react';

export default function FlipCard({card : {id, french, english}}) {

  console.log("card: " + french);
    return (
      <div>
        <h3>Card</h3>
        <span>{french}</span>
        <br />
        <span>{english}</span>
        <br />
      </div>
    );
}
