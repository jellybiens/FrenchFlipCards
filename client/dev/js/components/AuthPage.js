import React, { Component, Fragment } from 'react';
import { Redirect  } from 'react-router-dom';
import { ApolloConsumer } from 'react-apollo';
import { USER_LOGIN, USER_SIGN_UP } from '../queries.js';

import AuthContext from '../../context/auth-context';

export class AuthPage extends Component {

  static contextType = AuthContext;

  constructor(props){
    super(props);
    this.usernameEl = React.createRef();
    this.password1El = React.createRef();
    this.password2El = React.createRef();

    this.state = {
          loginView: true,
          errMsg: "",
          redirect: false
      }
  }

  throwError(err){
    this.setState({errMsg: err});
  }

  loginValidation(client){
    let username = this.usernameEl.current.value.trim();
    let password = this.password1El.current.value.trim();

    if(username.length === 0){ this.throwError("Please enter username."); return; }
    if(password.length === 0){ this.throwError("Please enter password."); return; }

    this.submitForm(client, username, password, "login");
  }

  signupValidation(client){
    let username = this.usernameEl.current.value.trim();
    let password1 = this.password1El.current.value.trim();
    let password2 = this.password2El.current.value.trim();

    if(username.length === 0){ this.throwError("Please enter username."); return; }
    if(password1.length < 5){ this.throwError("Password must be at least 6 characters."); return; }
    if(password1.length === 0 || password2.length === 0){ this.throwError("Please enter both passwords."); return; }
    if(password1 !== password2 ){ this.throwError("Passwords do not match!"); return; }


    this.submitForm(client, username, password1, "signup");
  }


  submitForm(client, username, password, formType){

    const variables = { username: username, password: password };
    if(formType === "login"){
      client.query({
        query: USER_LOGIN,
        variables: variables
      }).then(resData => this.logInUser(resData))
        .catch(err => {this.setState({errMsg: err.message.split(": ")[1]})
      console.log(err)});
    }else{
      client.mutate({
        mutation: USER_SIGN_UP,
        variables: variables
      }).then(data => this.setState({redirect: "/AuthPage"}))
        .catch(err => this.setState({errMsg: err.message.split(": ")[1]}));
    }
  }

  logInUser(resData){

    if(resData.data.userLogin.token){
      this.context.login(
        resData.data.userLogin.token,
        resData.data.userLogin.userid,
        resData.data.userLogin.admin,
        resData.data.userLogin.tokenExpiration
      );
    }
  }

  render() {

    if(this.state.redirect) return <Redirect to={this.state.redirect} />

    return (
      <ApolloConsumer>
        {client => (
          <div className="AuthPage">
            <form>

              <input type="text" id="username" ref={this.usernameEl} placeholder="username" />
              <input type="password" id="password1" ref={this.password1El} placeholder="password" />
              {this.state.loginView && <button type="button" onClick={() => this.loginValidation(client)}>Login</button>}

              {!this.state.loginView && <input type="password" id="password2" ref={this.password2El} placeholder="retype password" />}
              {!this.state.loginView && <button type="button" onClick={() => this.signupValidation(client)}>Sign Up</button>}

              <div className="errorMessage"><span>{this.state.errMsg}</span></div>
              <button className="switchView"
                      type="button"
                      onClick={() => {
                        this.setState({loginView: !this.state.loginView, errMsg: ""});
                        this.usernameEl.current.value = "";
                        this.password1El.current.value = "";
                      }} >
                      {this.state.loginView ? "Switch to Sign Up" : "Switch to Login"}
              </button>
              <button className="guestSignIn"
                      type="button"
                      onClick={() => this.submitForm(client, "guest", "password123", "login")} >
                      Login as Guest
              </button>
            </form>
          </div>
        )}
      </ApolloConsumer>
    );
  }
}

export default AuthPage;
