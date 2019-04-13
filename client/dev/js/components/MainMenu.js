import React, { Component, Fragment } from 'react';
import { Redirect  } from 'react-router-dom';

import AuthContext from '../../context/auth-context';

export class MainMenu extends Component {

  static contextType = AuthContext;

  constructor(){
    super();
      this.state = {
        wordType: [],
        focussed: "all",
        frontFace: "both",
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

    if(this.state.onyva) return <Redirect to={{pathname:"/FlipCards", state:{ wordType: wordType, focussed: focussed, frontFace: frontFace }}} />

    return (
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
               <span>ADJECTIVES</span>
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
            <span>BOTH</span>
          </div>
          <div className={frontFace == "english" ? "english-opt active" : "english-opt"}
               onClick={() => this.setState({frontFace: "english"})}
              >
            <span>ENGLISH</span>
          </div>

        </div>

        <div className="confirm-options">
          <button onClick={() => this.setState({onyva: true})}>ON Y VA!</button>
        </div>


      </div>
    );
  }
}

export default MainMenu;
