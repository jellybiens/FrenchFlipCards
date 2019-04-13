import React, { Component, Fragment } from 'react';
import { Redirect, NavLink  } from 'react-router-dom';

import { Query } from 'react-apollo';
import { ALL_CARDS_QUERY } from '../queries.js';

import AuthContext from '../../context/auth-context';

import FlipCard from './FlipCard';

export class FlipCards extends Component {

  static contextType = AuthContext

  constructor(){
    super();
      this.state = {
          endofstack: false
      }
  }

  render() {
    let wordType = this.props.location.state.wordType;
        wordType = wordType.length === 0 ? undefined : wordType;
    let focussed = this.props.location.state.focussed;
    let frontFace = this.props.location.state.frontFace;

    return (
      <div className="cards_deck">
        <div className="left-gradient"></div>
        <div className="right-gradient"></div>
        <Query query={ALL_CARDS_QUERY} variables={{ wordType }} >
          {({loading, error, data}) => {
            if(loading) return <h2>Loading...</h2>
            if(error) {console.log(error); this.context.signout(); return <Redirect to="/" />}

              return <Fragment>
              {
                  data.cards.map((card, i) => (
                    <FlipCard key={i} card={card} final={i == data.cards.length - 1} endofstack={() => this.setState({endofstack: true})} />
                  ))
              }
              </Fragment>
            }
          }
        </Query>
          <div className="correct-box"><span>Je sais cela!</span></div>
          <div className="wrong-box"><span>J'en ai aucune idée...</span></div>
          {this.state.endofstack && <NavLink to="/MainMenu"><button className="end-of-stack">End of stack</button></NavLink>}
      </div>
    );
  }
}

export default FlipCards;
