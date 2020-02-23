import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import AuthContext from '../../context/auth-context';
import { Mutation } from 'react-apollo';
import { UPDATE_SCORE_POS, UPDATE_SCORE_NEG } from '../queries.js';
import { Emojione } from "react-emoji-render";


const Swing = require('swing');
import { destroyCard, disableSwipe } from './destroyCard';


export class FlipCard extends Component {

  static contextType = AuthContext;

  constructor(){
    super();
      this.state = {
          flip: false
      }
  }

  flipCard(){
    this.setState({
      flip: !this.state.flip
    });
  }

  componentDidMount(){
    if(this.props.final) this.buildCards();

  }

  buildCards(){

    const cards = [].slice.call(document.querySelectorAll('.card'));

    const config = {
      allowedDirections: [Swing.Direction.LEFT, Swing.Direction.RIGHT],
      throwOutConfidence: (xOffset, yOffset, element) => {
        const xConfidence = Math.min(Math.abs(xOffset) / (element.offsetWidth/1.5), 1);
        const yConfidence = Math.min(Math.abs(yOffset) / (element.offsetHeight/1.5), 1);

        return Math.max(xConfidence, yConfidence);
      }
    };

    const stack = Swing.Stack(config);

    cards.forEach((targetElement) => {
      stack.createCard(targetElement);
    });



    stack.on('throwout', (event) => {

      const dir = event.throwDirection == Swing.Direction.RIGHT ? true : false;
      if(destroyCard(dir, true)) this.props.endofstack();

    });




    stack.on('dragmove', (event) => {

      let viewWidth = document.querySelector('.cards_deck').clientWidth;

      let left = document.querySelector('.left-gradient')
      let right = document.querySelector('.right-gradient')
      let correct = document.querySelector('.correct-box')
      let wrong = document.querySelector('.wrong-box')

      let elems = [ left, right, correct, wrong ];

      elems.map(elem => {
        elem.style.transition = '0s';
      });

      if(event.offset > 0){
        right.style.opacity = (event.offset/viewWidth);
        correct.style.opacity = (event.offset/(viewWidth/3));
        left.style.opacity = 0;
        wrong.style.opacity = 0;
      }else{
        left.style.opacity = (Math.abs(event.offset)/viewWidth);
        wrong.style.opacity = (Math.abs(event.offset)/(viewWidth/3));
        right.style.opacity = 0;
        correct.style.opacity = 0;
      }

    });




    stack.on('dragend', (event) => {

      let elems = [ document.querySelector('.left-gradient'),
                    document.querySelector('.right-gradient'),
                    document.querySelector('.correct-box'),
                    document.querySelector('.wrong-box')
                  ];

      elems.map(elem => {
        elem.style.opacity = 0;
        elem.style.transition = '0.5s';
      });


    });


    const checkKey = (e) => {
      if (e.keyCode == '37' || e.keyCode == '39') { //leftArr
        const dir = e.keyCode == '39' ? true : false;
        if(destroyCard(dir, false)) this.props.endofstack();
      }
      else if (e.keyCode == '32') {//spaceBar
        e = e || window.event;
        document.querySelector('.card:last-child').click();
      }
    }


    document.onkeydown = checkKey;
  }

render(){

    let english = this.props.card.english;
    let french = this.props.card.french;
    let wordType = this.props.card.wordType;
    // /((?<!\S)[\u00E0](?!\S)|\bde\b|\bse\b|\bs')/g
    const àgex = /((?<!\S)[\u00E0](?!\S))/g;
    const degex = /((?<!\S)de(?!\S))/g;
    const segex = /((?<!\S)se(?!\S)|\bs')/g;
    french = french.replace(àgex, '<b class="redA">$1</b>');
    french = french.replace(degex, '<b class="blueDE">$1</b>');
    french = french.replace(segex, '<b class="orangeSE">$1</b>');

    let cardid = this.props.card._id;
    let frontWord = this.props.frontFace === "english" ? english : french;
    let backWord = this.props.frontFace === "english" ? french : english;


    return (
      <div className="card" onClick={() => this.flipCard()} id={cardid}>
        <div className="flip-container">
          <div className={!this.state.flip ? "flipper" : "flipper flipped"}>
            <div className={"front " + wordType + "-card"}>
              <Emojione text={frontWord} />
            </div>
            <div className={"back " + wordType + "-card"}>
              <Emojione text={backWord} />
            </div>
          </div>
        </div>

        <Mutation mutation={UPDATE_SCORE_POS}>
          {(updateScorePos, { data }) => (
            <form
              className="submitPos"
              onSubmit={e => {
                if (!this.context.userid) {
                  this.context.signout();
                  return <Redirect to="/" />;
                }
                e.preventDefault();
                updateScorePos({
                  variables: { userid: this.context.userid, wordid: cardid }
                });
              }}
            ></form>
          )}
        </Mutation>

        <Mutation mutation={UPDATE_SCORE_NEG}>
          {(updateScoreNeg, { data }) => (
            <form
              className="submitNeg"
              onSubmit={e => {
                if (!this.context.userid) {
                  this.context.signout();
                  return <Redirect to="/" />;
                }
                e.preventDefault();
                updateScoreNeg({
                  variables: { userid: this.context.userid, wordid: cardid }
                });
              }}
            ></form>
          )}
        </Mutation>
      </div>
    );
  }

}

export default FlipCard;
