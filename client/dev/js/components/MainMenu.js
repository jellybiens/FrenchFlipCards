import React, { Component, Fragment } from 'react';
import { Redirect, NavLink  } from 'react-router-dom';

import AuthContext from '../../context/auth-context';

import Navigation from './Navigation'

export class MainMenu extends Component {

  static contextType = AuthContext;

  constructor(){
    super();
      this.state = {
        wordType: [],
        focussed: "all",
        frontFace: "french",
        limit: 10,
        onyva: false
      }
  }

  setWordType(type){
    let arr = this.state.wordType.slice();
    var i = arr.indexOf(type);

    if (i > -1)
       arr.splice(i, 1);
    else
      arr.push(type);

    this.setState({wordType: arr});
  }

  render() {

    let wordType = this.state.wordType;
    let focussed = this.state.focussed;
    let frontFace = this.state.frontFace;
    let limit = this.state.limit;


    if(this.state.onyva) return <Redirect to={{pathname:"/FlipCards", state:{ wordType: wordType, focussed: focussed, frontFace: frontFace, limit: limit }}} />

    return (
      <Fragment>
      <Navigation path={this.props.location.pathname}
                  context={this.context} />
      <div className="main-menu">
        <div className="cards-types-header"><span>WORD TYPES</span></div>
        <div className="cards-types-options">
          <div className={!wordType.includes("verb") ? "verb-opt" : "verb-opt active"}
               onClick={() => this.setWordType("verb")}>
               <span>VERBS</span>
          </div>

          <div className={!wordType.includes("noun") ? "noun-opt" : "noun-opt active"}
               onClick={() => this.setWordType("noun")}>
               <span>NOUNS</span>
          </div>

          <div className={!wordType.includes("adj") ? "adj-opt" : "adj-opt active"}
               onClick={() => this.setWordType("adj")}>
               <span>PREPOSITIONS<br />DESCRIPTIONS</span>
          </div>
        </div>

        <div className="cards-focus-header"><span>STUDY FOCUS</span></div>
        <div className="cards-focus-options">
          <div className={focussed == "all" ? "all-opt active" : "all-opt"}
               onClick={() => this.setState({focussed: "all"})}
                >
            <span>ALL CARDS</span>
          </div>

          <div className={focussed == "focussed" ? "focus-opt active" : "focus-opt"}
               onClick={() => this.setState({focussed: "focussed"})}
              >
            <span>UNFAMILIAR</span>
          </div>
        </div>

        <div className="cards-front-header"><span>FRONT FACE LANGUAGE</span></div>
        <div className="cards-front-options">
          <div className={frontFace == "french" ? "french-opt active" : "french-opt"}
               onClick={() => this.setState({frontFace: "french"})}
              >
            <span>FRENCH</span>
          </div>
          <div className={frontFace == "both" ? "both-opt active" : "both-opt"}
               onClick={() => this.setState({frontFace: "both"})}
              >
            <span>MIXED</span>
          </div>
          <div className={frontFace == "english" ? "english-opt active" : "english-opt"}
               onClick={() => this.setState({frontFace: "english"})}
              >
            <span>ENGLISH</span>
          </div>

        </div>


        <div className="cards-limit-header"><span>TOTAL CARDS LIMIT</span></div>
        <div className="cards-limit-options">
          <div className={limit === 10 ? "opt-10 active" : "opt-10"}
               onClick={() => limit !== 10 ? this.setState({limit: 10}) : this.setState({limit: 1000})}
              >
            <span>10</span>
          </div>
          <div className={limit === 25 ? "opt-25 active" : "opt-25"}
               onClick={() => this.setState({limit: 25})}
              >
            <span>25</span>
          </div>
          <div className={limit === 50 ? "opt-50 active" : "opt-50"}
               onClick={() => this.setState({limit: 50})}
              >
            <span>50</span>
          </div>
          <div className={limit === 100 ? "opt-100 active" : "opt-100"}
               onClick={() => this.setState({limit: 100})}
              >
            <span>100</span>
          </div>

        </div>



        <div className="confirm-options">
          <button onClick={() => this.setState({onyva: true})}>ON Y VA!</button>
        </div>


      </div>
      </Fragment>
    );
  }
}

export default MainMenu;
