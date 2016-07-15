import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PlaidLink from 'react-plaid-link';

// App component - represents the whole app
export default class App extends Component {

  handleOnSuccess (token, metadata) {
    console.log(token, metadata);
  }
  render() {
    return (
      <div className="container">
        <header>
          <h1>Welcome to Finance AI</h1>
        </header>
        <PlaidLink
           publicKey={Meteor.settings.public.plaid_public_key}
           product="auth"
           env="tartan"
           clientName="plaidname"
           onSuccess={this.handleOnSuccess}
           />
      </div>
    );
  }
}
