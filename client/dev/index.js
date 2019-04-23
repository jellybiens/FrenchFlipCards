import React from 'react';
import ReactDOM from 'react-dom';
import './scss/style.scss';
import App from './js/App';


import { ApolloProvider } from "react-apollo";

import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';

//import ApolloClient from 'apollo-boost';

import { BrowserRouter } from 'react-router-dom';


const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'network-only',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'network-only',
    errorPolicy: 'all',
  },
};

const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: localStorage.getItem("token") ? `Bearer ${JSON.parse(localStorage.getItem("token")).token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  defaultOptions: defaultOptions,
  cache: new InMemoryCache()
});






// const client = new ApolloClient({
//   uri: 'http://localhost:5000/graphql',
//   request: operation => {
//     operation.setContext(context => ({
//       headers: {
//         ...context.headers,
//         authorization:  localStorage.getItem("token") ? `Bearer ${JSON.parse(localStorage.getItem("token")).token}` : "",
//       },
//     }));
//   }
//
// });


ReactDOM.render(
    <BrowserRouter>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </BrowserRouter>

    , document.getElementById('root'));






    //
    // const defaultOptions = {
    //   watchQuery: {
    //     fetchPolicy: 'network-only',
    //     errorPolicy: 'ignore',
    //   },
    //   query: {
    //     fetchPolicy: 'network-only',
    //     errorPolicy: 'all',
    //   },
    // };
    //
    // const httpLink = createHttpLink({
    //   uri: 'http://localhost:5000/graphql',
    // });
    //
    // const authLink = setContext((_, { headers }) => {
    //   const token = JSON.parse(localStorage.getItem("token")).token;
    //   return {
    //     headers: {
    //       ...headers,
    //       authorization: token ? `Bearer ${token}` : "",
    //     }
    //   }
    // });
    //
    // const client = new ApolloClient({
    //   link: authLink.concat(httpLink),
    //   //defaultOptions: defaultOptions,
    //   cache: new InMemoryCache()
    // });
    //
    //
    //
    //
    //
