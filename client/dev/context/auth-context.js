import React from 'react';

export default React.createContext({
  token: localStorage.getItem("token") || null,
  userid: localStorage.getItem("userid") || null,
  tokenExpiration: localStorage.getItem("tokenExpiration") || null,
  login: () => {},
  logout: () => {}
});
