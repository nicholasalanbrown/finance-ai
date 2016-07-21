import { Meteor } from 'meteor/meteor';
import { Transactions } from '../../api/transactions/transactions.js';
import _ from 'underscore';
const mintData = require('./mint-data.json');

Meteor.startup(() => {

  console.log('Refreshing fixtures data...');

  Transactions.remove({});
  _.each(mintData, function (transaction) {
    Transactions.insert(transaction);
  })

});
