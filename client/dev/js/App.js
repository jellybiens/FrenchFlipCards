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
    super();
      this.state = {
        token: localStorage.getItem("token") || null,
        userid: null,
        tokenExpiration: null
      }
  }

  sessionlogin = (token, userid, tokenExpiration) => {
    localStorage.setItem("token", token);

    this.setState({
      token: token,
      userid: userid,
      tokenExpiration: tokenExpiration
    });
  }


  sessionsignout = () => {
    localStorage.removeItem("token");

    this.setState({
      token: null,
      userid: null,
      tokenExpiration: null
    });
  }

  render() {

    let token = this.state.token;

    return (

      <AuthContext.Provider value={{
                                    token: this.state.token,
                                    userid: this.state.userid,
                                    tokenExpiration: this.state.tokenExpiration,
                                    login: this.sessionlogin,
                                    signout: this.sessionsignout,
                                  }}>

        <div className="App">
            {token && <div className="sign-out"><button className="sign-out" onClick={()=> this.sessionsignout()}>Sign Out</button></div>}
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
