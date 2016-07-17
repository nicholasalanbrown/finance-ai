import { Meteor } from 'meteor/meteor';
import { Transactions } from '../../api/transactions/transactions.js';
let mintData = require('./mint-data.json');


Meteor.startup(() => {
  if (Transactions.find().count() === 0) {
    mintData.forEach((transaction) => {
      const transactionId = Transactions.insert(transaction);
    });
  }
});
