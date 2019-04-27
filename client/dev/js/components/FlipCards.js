import React, { Component, Fragment } from 'react';
import { Redirect, NavLink  } from 'react-router-dom';

import { Query } from 'react-apollo';
import { ALL_CARDS_QUERY, FOCUSS_CARDS_QUERY } from '../queries.js';

import AuthContext from '../../context/auth-context';

import FlipCard from './FlipCard';
import LoadingFlipper from './LoadingFlipper';
import Navigation from './Navigation'
import { destroyCard, disableSwipe } from './destroyCard';
import imgTick from '../../imgs/tick.png';
import imgCross from '../../imgs/cross.png';
import tapgif from '../../imgs/screentap.gif';

export class FlipCards extends Component {

  static contextType = AuthContext

  constructor(){
    super();
      this.state = {
          goBack: false,
          runAnimation: false
      }
  }

  buildCards(loading, error, data, frontFace){
    if(loading) return <LoadingFlipper />
    if(error) {console.log(error); this.context.signout(); return <Redirect to="/" />}
    if(data.cards.length === 0) return <NavLink to="/MainMenu"><button className="end-of-stack">No cards found!</button></NavLink>
      return <Fragment>
      {
          data.cards.map((card, i) => {
            let langSideUp = frontFace === "both" ? (i % 2 == 0) ? 'french' : 'english' : frontFace;
            return <FlipCard key={i} card={card} frontFace={langSideUp} final={i == data.cards.length - 1} endofstack={() => this.setState({goBack: true})} />
          })
      }
      </Fragment>
  }

  swipeDir(dir){
    if(destroyCard(dir, false)) this.setState({goBack: true});
  }

  destroyTutorialComponents(){
    document.querySelector('.tap-gif').remove();
    document.querySelector('.correct-tut').remove();
    document.querySelector('.wrong-tut').remove();
    document.querySelector('.button-tut').remove();
  }

  componentDidMount(){
    if(!this.context.viewTutorial){
      document.querySelector('.tap-gif-img').remove();
      document.querySelector('.tap-start-tut').remove();
      document.querySelector('.tap-gif').remove();
      document.querySelector('.correct-tut').remove();
      document.querySelector('.wrong-tut').remove();
      document.querySelector('.button-tut').remove();
    }
  }

  componentDidUpdate(){
    if(this.state.runAnimation && this.context.viewTutorial){
      this.context.tutorialViewed();
      document.querySelector('.tap-gif-img').remove();
      document.querySelector('.tap-start-tut').remove();
      window.setTimeout(() => {
        this.destroyTutorialComponents();
        this.setState({runAnimation: false})
      }, 12000);
    }
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
      <Fragment>
      <Navigation path={this.props.location.pathname}
                  context={this.context} />
        <div className={this.state.runAnimation ? "cards_deck tutorial-animation" : "cards_deck"}>

          <div className="left-gradient"></div>
          <div className="right-gradient"></div>
          <div className="tap-gif" onClick={() => !this.state.runAnimation ? this.setState({runAnimation: true}) : {}}><img className="tap-gif-img" src={tapgif} /></div>
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
            <div className="tap-start-tut"><span>Tap card to flip it</span></div>
            <div className="correct-tut"><span>Swipe RIGHT if you know it</span></div>
            <div className="wrong-tut"><span>Swipe LEFT if you don't</span></div>
            <div className="button-tut"><span>Or use the corresponding buttons</span></div>
            {this.state.goBack && <NavLink to="/MainMenu"><button className="end-of-stack">End of stack</button></NavLink>}
        </div>
      </Fragment>
    );
  }
}

export default FlipCards;
