import React from 'react';
import { NavLink  } from 'react-router-dom';
import { ApolloConsumer } from 'react-apollo';

const Navigation = ({path, context}) => (
  <div className="nav-buttons">
  <div className="left-container">
      {context.token &&
        <a ><ApolloConsumer>{client =>
            (<div className="sign-out"><button onClick={() => context.signout()}>Sign Out</button></div>)
        }</ApolloConsumer></a>
      }
  </div>
  <div className="right-container">
      {context.admin && path === "/MainMenu" &&
              <NavLink to="/AddWords"><div className="add-cards-btn"><button>Add Cards</button></div></NavLink>
            }
      {context.token && path !== "/MainMenu" &&
              <NavLink to="/MainMenu"><div className="go-back"><button>Go Back</button></div></NavLink>
            }
  </div>
  </div>
);

export default Navigation;
