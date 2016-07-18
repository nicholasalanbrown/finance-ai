import { Meteor } from 'meteor/meteor';
import { Transactions } from '../../api/transactions/transactions.js';
import jsonfile from 'jsonfile';
import _ from 'underscore';
import moment from 'moment';
const transactions = require('./transactions.json');
const base = process.env.PWD;
const path = require('path');
const fs = require('fs');

Meteor.startup(() => {

  if (Transactions.find().count() === 0) {

    _.each(transactions, function(transaction) {
      Transactions.insert(transaction);
    })

  }


});
