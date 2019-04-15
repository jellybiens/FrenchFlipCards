import React, { Component, Fragment } from 'react';
import { Redirect, NavLink } from 'react-router-dom';
import { ApolloConsumer } from 'react-apollo';
import { CREATE_CARD } from '../queries.js';


import AuthContext from '../../context/auth-context';


export class AddWords extends Component {


  static contextType = AuthContext;

  constructor(props){
    super(props);
    this.french = React.createRef();
    this.english = React.createRef();

    this.state = {
          wordType: "",
          resMsg: "",
          errMsg: "",
          goback: false
      }
  }

  throwError(err){
    this.setState({errMsg: err});
  }

  addCard(client){

    let french = this.french.current.value;
    let english = this.english.current.value;
    let wordType = this.state.wordType;

    if(french.trim().length === 0){ this.setState({errMsg: "Please fill in FRENCH field"}); return; }
    if(english.trim().length === 0){ this.setState({errMsg: "Please fill in ENGLISH fields"}); return; }
    if(wordType.trim().length === 0){ this.setState({errMsg: "Please select a WORD TYPE"}); return; }

    const variables = { french: french, english: english, wordType: wordType };

      client.mutate({
        mutation: CREATE_CARD,
        variables: variables
      }).then(resData => {
        this.setState({resMsg: "Card Added"});
        this.french.current.value = "";
        this.english.current.value = "";
        window.setTimeout(()=>{this.setState({resMsg: ""})}, 5000);

     }).catch(err => {
       this.setState({errMsg: err.message.split(": ")[1]})
       console.log(err);
     });
  }

  render() {

    if(!this.context.admin) return <Redirect to="/" />

    let wordType = this.state.wordType;

    return (
      <ApolloConsumer>
        {client => (
          <div className="add-cards">
            <NavLink to="/MainMenu"><div className="go-back"><button>Go Back</button></div></NavLink>
            <form>

              <input type="text" id="french" ref={this.french} placeholder="french" />
              <input type="text" id="english" ref={this.english} placeholder="english" />

              <div className="cards-types-header"><span>WORD TYPE</span></div>
              <div className="cards-types-options">
                <div className={wordType !== "verb" ? "verb-opt" : "verb-opt active"}
                     onClick={() => this.setState({wordType: "verb"})}>
                     <span>VERB</span>
                </div>

                <div className={wordType !== "noun" ? "noun-opt" : "noun-opt active"}
                     onClick={() => this.setState({wordType: "noun"})}>
                     <span>NOUN</span>
                </div>

                <div className={wordType !== "adj" ? "adj-opt" : "adj-opt active"}
                     onClick={() => this.setState({wordType: "adj"})}>
                     <span>ADJECTIVE</span>
                </div>
              </div>

              <div className="resMessage"><span>{this.state.resMsg}</span></div>
              <div className="errorMessage"><span>{this.state.errMsg}</span></div>
              <button type="button" onClick={() => this.addCard(client)}>Add Card</button>
            </form>
          </div>
        )}
      </ApolloConsumer>
    );
  }
}

export default AddWords;
