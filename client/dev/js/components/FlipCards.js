import React, { Component, Fragment } from 'react';
import { Redirect, NavLink  } from 'react-router-dom';

import { Query } from 'react-apollo';
import { ALL_CARDS_QUERY, FOCUSS_CARDS_QUERY } from '../queries.js';

import AuthContext from '../../context/auth-context';

import FlipCard from './FlipCard';
import LoadingFlipper from './LoadingFlipper';
import { destroyCard, disableSwipe } from './destroyCard';
import imgTick from '../../imgs/tick.png';
import imgCross from '../../imgs/cross.png';

export class FlipCards extends Component {

  static contextType = AuthContext

  constructor(){
    super();
      this.state = {
          goBack: false
      }
  }

  buildCards(loading, error, data, frontFace){
    if(loading) return <LoadingFlipper />
    if(error) {console.log(error); this.context.signout(); return <Redirect to="/" />}
    if(data.cards.length === 0) return <NavLink to="/MainMenu"><button className="end-of-stack">No cards found!</button></NavLink>
      return <Fragment>
      {
          data.cards.map((card, i) => {
            let langSideUp = frontFace === "both" ? (Math.floor(Math.random() * 2) == 0) ? 'french' : 'english' : frontFace;
            return <FlipCard key={i} card={card} frontFace={langSideUp} final={i == data.cards.length - 1} endofstack={() => this.setState({goBack: true})} />
          })
      }
      </Fragment>
  }

  swipeDir(dir){
    if(destroyCard(dir, false)) this.setState({goBack: true});
  }


  render() {
    let wordType = this.props.location.state.wordType;
        wordType = wordType.length === 0 ? undefined : wordType;
    let focussed = this.props.location.state.focussed;
    let frontFace = this.props.location.state.frontFace;
    let limit = this.props.location.state.limit;
    let userid = this.context.userid;

    let query = focussed === "all" ?
                                   (<Query query={ALL_CARDS_QUERY} variables={{ wordType, limit }} >
                                      {({loading, error, data}) => this.buildCards(loading, error, data, frontFace)
                                      }
                                    </Query>)
                                   :
                                   (<Query query={FOCUSS_CARDS_QUERY} variables={{ wordType, userid, limit }} >
                                      {({loading, error, data}) => this.buildCards(loading, error, data, frontFace)
                                      }
                                    </Query>)
                                   ;

    return (
      <div className="cards_deck">
        <NavLink to="/MainMenu"><div className="go-back"><button>Go Back</button></div></NavLink>
        <div className="left-gradient"></div>
        <div className="right-gradient"></div>
        {query}

        <div className="swipe-buttons">
          <div className="button-left" onClick={() => this.swipeDir(false)}>
            <img src={imgCross} />
          </div>
          <div className="button-right" onClick={() => this.swipeDir(true)}>
            <img src={imgTick} />
          </div>
        </div>
          <div className="correct-box"><span>Je sais cela!</span></div>
          <div className="wrong-box"><span>J'en ai aucune idée...</span></div>
          {this.state.goBack && <NavLink to="/MainMenu"><button className="end-of-stack">End of stack</button></NavLink>}
      </div>
    );
  }
}

export default FlipCards;
