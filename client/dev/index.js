import React from 'react';
import ReactDOM from 'react-dom';
import './scss/style.scss';
import App from './js/App';

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

import { BrowserRouter } from 'react-router-dom';

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',
  request: operation => {
    operation.setContext(context => ({
      headers: {
        ...context.headers,
        authorization:  localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : "",
      },
    }));
}});


ReactDOM.render(
    <BrowserRouter>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </BrowserRouter>

    , document.getElementById('root'));
