import React, { Component, Fragment } from 'react';
import { BrowserRouter, Route, Redirect, Switch  } from 'react-router-dom';

import { ApolloConsumer } from 'react-apollo';
import AuthContext from '../context/auth-context';

import { Query } from 'react-apollo';
import { AUTH_TOKEN_VALIDATE } from './queries.js';

import LoadingFlipper from './components/LoadingFlipper'
import AuthPage from './components/AuthPage';
import MainMenu from './components/MainMenu';
import FlipCards from './components/FlipCards';
import AddWords from './components/AddWords';


//TODO //
//don't cache flipcard responses
//or shuffle the cards


class App extends Component {

  static contextType = AuthContext;

  constructor(){
    //get current time
    const now = new Date();
    const blankToken = { token: null, userid: null, admin: null, tokenExpiration: null, refresh: false };

    //is there a token in localstorage?
    let token = localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : blankToken;

    //if there is, is it still valid?
    if(token.token)
    {
      token = token.tokenExpiration > now.getTime() ?
                { //if still valid, lets create a new token session with refresh
                  token: token.token,
                  userid: token.userid,
                  admin: token.admin,
                  tokenExpiration: token.tokenExpiration,
                  refresh: true
                } : blankToken //if it is not still in date, lets get them to log back in again
    }

    //lets assign all this to the state
    super();
      this.state = {
        token: token.token,
        userid: token.userid,
        admin: token.admin,
        tokenExpiration: token.tokenExpiration,
        refresh: token.refresh,
        viewTutorial: true
      }
  }

  setTutorialViewed = () => {
    this.setState({viewTutorial: false})
  }

  sessionlogin = (token, userid, admin, tokenExpiration) => {


    const tokenObj = { token: token, userid: userid, admin: admin, tokenExpiration: tokenExpiration };

    localStorage.setItem("token", JSON.stringify(tokenObj));

    this.setState({
      token: token,
      userid: userid,
      admin: admin,
      tokenExpiration: tokenExpiration,
      refresh: false
    });
  }


  sessionsignout = () => {
    localStorage.removeItem("token");

    this.setState({
      token: null,
      userid: null,
      admin: false,
      tokenExpiration: null,
      refresh: false
    });

  }

  render() {

    let token = this.state.token;
    let userid = this.state.userid;
    let refresh = this.state.refresh;

    //if we have a token and it is still valid, lets refresh its log out time and instantly log the user in below
    if(token && refresh) return (<Query query={AUTH_TOKEN_VALIDATE} variables={{ userid }} >
                       {({loading, error, data}) => {
                         if(loading){ return <Fragment><LoadingFlipper /></Fragment>; }
                         if(error){ this.sessionsignout(); return <Fragment></Fragment>; }
                         if(data){ this.sessionlogin(data.authTokenValidate.token,
                                                      data.authTokenValidate.userid,
                                                      data.authTokenValidate.admin,
                                                      data.authTokenValidate.tokenExpiration); return <Fragment></Fragment>; }
                          }
                       }
                     </Query>);

    return (

      <AuthContext.Provider value={{
                                    token: this.state.token,
                                    userid: this.state.userid,
                                    admin: this.state.admin,
                                    tokenExpiration: this.state.tokenExpiration,
                                    viewTutorial: this.state.viewTutorial,
                                    tutorialViewed: this.setTutorialViewed,
                                    login: this.sessionlogin,
                                    signout: this.sessionsignout,
                                  }}>

        <div className="App">
            {token &&
              <ApolloConsumer>{client =>
                  (<div className="sign-out"><button onClick={()=> this.sessionsignout()}>Sign Out</button></div>)
              }</ApolloConsumer>
            }
            <Switch>

              {!token && <Redirect path="/" to="/AuthPage" exact />}
              {!token && <Redirect path="/FlipCards" to="/AuthPage" exact />}
              {!token && <Redirect path="/MainMenu" to="/AuthPage" exact />}
              {!token && <Redirect path="/AddWords" to="/AuthPage" exact />}
              {token && <Redirect path="/" to="/MainMenu" exact />}
              {token && <Redirect path="/AuthPage" to="/MainMenu" exact />}

              <Route path="/AuthPage" component={AuthPage} />
              <Route path="/MainMenu" component={MainMenu} />
              <Route path="/FlipCards" component={FlipCards} />
              <Route path="/AddWords" component={AddWords} />

            </Switch>

        </div>

        </AuthContext.Provider>
    );
  }
}

export default App;
