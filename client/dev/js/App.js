import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch  } from 'react-router-dom';

import AuthContext from '../context/auth-context';

import AuthPage from './components/AuthPage';
import MainMenu from './components/MainMenu';
import FlipCards from './components/FlipCards';
import AddWords from './components/AddWords';


class App extends Component {

  static contextType = AuthContext;

  constructor(){

    const token = localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token"))
                : {
                  token:  null,
                  userid: null,
                  admin: false,
                  tokenExpiration: null
                };

    super();
      this.state = {
        token: token.token || null,
        userid: token.userid ||  null,
        admin: token.admin ||  false,
        tokenExpiration: token.tokenExpiration || null
      }
  }

  sessionlogin = (token, userid, admin, tokenExpiration) => {

    const tokenObj = { token: token, userid: userid, admin: admin, tokenExpiration: tokenExpiration };

    localStorage.setItem("token", JSON.stringify(tokenObj));

    this.setState({
      token: token,
      userid: userid,
      admin: admin,
      tokenExpiration: tokenExpiration
    });
  }


  sessionsignout = () => {
    localStorage.removeItem("token");

    this.setState({
      token: null,
      userid: null,
      admin: false,
      tokenExpiration: null
    });
  }

  render() {

    let token = this.state.token;

    return (

      <AuthContext.Provider value={{
                                    token: this.state.token,
                                    userid: this.state.userid,
                                    admin: this.state.admin,
                                    tokenExpiration: this.state.tokenExpiration,
                                    login: this.sessionlogin,
                                    signout: this.sessionsignout,
                                  }}>

        <div className="App">
            {token && <div className="sign-out"><button onClick={()=> this.sessionsignout()}>Sign Out</button></div>}
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
