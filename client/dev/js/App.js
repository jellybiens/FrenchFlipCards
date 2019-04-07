import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import FlipCards from './components/FlipCards';

//TODO CHANGE
const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql'
});

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client} >
        <div className="App">
          <FlipCards />
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
