import React, { Component, Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import AuthContext from '../../context/auth-context';
import { Mutation } from 'react-apollo';
import { UPDATE_SCORE_POS, UPDATE_SCORE_NEG } from '../queries.js';

const Swing = require('swing');


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

      if(event.throwDirection == Swing.Direction.RIGHT){
        event.target.querySelector('.submitPos').dispatchEvent(new Event('submit'));
      }
      else if(event.throwDirection == Swing.Direction.LEFT){
        event.target.querySelector('.submitNeg').dispatchEvent(new Event('submit'));
      }

      let parent = event.target.parentNode

      let card = stack.getCard(event.target)
      card.destroy();
      event.target.remove()
      if(parent.childElementCount === 4) this.props.endofstack();

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

  }

render(){

  console.log(this.context.userid)
    let cardid = this.props.card._id;
    let french = this.props.card.french;
    let english = this.props.card.english;

    return (
      <div className="card" onClick={() => this.flipCard()} id={cardid}>
        <div className="flip-container">
          <div className={!this.state.flip ? "flipper" : "flipper flipped"}>
            <div className="front">
              <span>{french}</span>
            </div>
            <div className="back">
              <span>{english}</span>
            </div>
          </div>
        </div>


        <Mutation mutation={UPDATE_SCORE_POS}>
          {(updateScorePos, { data }) => (
              <form className="submitPos"
                onSubmit={e => {
                  e.preventDefault();
                  updateScorePos({ variables: { userid: this.context.userid, wordid: cardid } });
                }}
              >
              </form>
            )
          }
        </Mutation>


        <Mutation mutation={UPDATE_SCORE_NEG}>
          {(updateScoreNeg, { data }) => (
              <form className="submitNeg"
                onSubmit={e => {
                  e.preventDefault();
                  updateScoreNeg({ variables: { userid: this.context.userid, wordid: cardid } });
                }}
              >
              </form>
            )
          }
        </Mutation>
      </div>
    );
  }

}

export default FlipCard;
