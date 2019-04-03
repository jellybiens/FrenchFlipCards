import React, { Component, Fragment } from 'react';

import { Query } from 'react-apollo';
import FlipCard from './FlipCard';
import { CARDS_QUERY } from '../queries.js';


export class FlipCards extends Component {
  render() {

    let wordType = ["noun"];

    return (
      <div>
        <h1>Cards</h1>
        <Query query={ALL_CARDS_QUERY} variables={{ wordType }}>
          {({loading, error, data}) => {
            if(loading) return <h2>Loading...</h2>
            if(error) console.log(error);

            return <Fragment>
            {
                data.cards.map(card => (
                  <FlipCard key={card.id} card={card} />
                ))
            }
            </Fragment>
          }
          }
        </Query>
      </div>
    );
  }
}

export default FlipCards;
