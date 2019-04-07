import React, { Component, Fragment } from 'react';

import { Query } from 'react-apollo';
import { ALL_CARDS_QUERY } from '../queries.js';

import FlipCard from './FlipCard';

export class FlipCards extends Component {



  render() {

    let wordType = undefined;

    return (
      <div className="cards_deck">
        <div className="left-gradient"></div>
        <div className="right-gradient"></div>
        <Query query={ALL_CARDS_QUERY} variables={{ wordType }} >
          {({loading, error, data}) => {
            if(loading) return <h2>Loading...</h2>
            if(error) console.log(error);

              return <Fragment>
              {
                  data.cards.map((card, i) => (
                    <FlipCard key={card.id} card={card} final={i == data.cards.length - 1} />
                  ))
              }
              </Fragment>
            }
          }
        </Query>
          <div className="correct-box"><span>Je sais cela!</span></div>
          <div className="wrong-box"><span>J'en ai aucune idée...</span></div>
      </div>
    );
  }
}

export default FlipCards;
