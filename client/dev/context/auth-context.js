import React from 'react';

const token = localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token"))
            : {
              token:  null,
              userid: null,
              admin: false,
              tokenExpiration: null
            };

export default React.createContext({
  token: token.token,
  userid: token.userid,
  admin: token.admin,
  tokenExpiration: token.tokenExpiration,
  login: () => {},
  logout: () => {}
});
