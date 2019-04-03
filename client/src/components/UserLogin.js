import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';

export class UserLogin extends Component {
  render() {

    return (
      <div>

        <Query query={} variables={{ }}>
          {({loading, error, data}) => {
            if(loading) return <h2>Loading...</h2>
            if(error) console.log(error);

            return <Fragment>
            {

            }
            </Fragment>
          }
          }
        </Query>
      </div>
    );
  }
}

export default UserLogin;
