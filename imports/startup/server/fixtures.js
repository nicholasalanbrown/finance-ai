import { Meteor } from 'meteor/meteor';
import { Transactions } from '../../api/transactions/transactions.js';
let mintData = require('./mint-data.json');
import plaid from 'plaid';
const plaidClient = new plaid.Client(Meteor.settings.plaid_client_id, Meteor.settings.plaid_secret, plaid.environments.tartan);

// if the database is empty on server start, create some sample data.
Meteor.startup(() => {
  plaidClient.addAuthUser('schwab', {username: 'nicholasalanbrown', password: 'ach1tung'}, function (error, response) {
    if (error) {
      console.log ("Error!");
      console.log(error);
    }
    else {
      console.log("Success!");
      console.log(response);
    }
  });
  if (Transactions.find().count() === 0) {
    mintData.forEach((transaction) => {
      const transactionId = Transactions.insert(transaction);
    });
  }
});
