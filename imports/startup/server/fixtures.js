import { Meteor } from 'meteor/meteor';
import { Transactions } from '../../api/transactions/transactions.js';
import jsonfile from 'jsonfile';
import _ from 'underscore';
import moment from 'moment';
const transactionTemplate = require('./transaction-template.json');
const mintData = require('./mint-data.json');
const categoryMappings = require('./category-mappings.json');
const base = process.env.PWD;
const path = require('path');
const fs = require('fs');

Meteor.methods({
  transformMintData(data, filename) {

    let jsonArray = [];

    let newTransaction = transactionTemplate;
    _.each(data, function(mint) {

      newTransaction.name = mint.description;
      newTransaction.date = moment(mint.date).toISOString();
      newTransaction.amount = mint.amount;

      let mappedCategory = _.findWhere(categoryMappings, {mint: mint.category});
      let categoryArray = [];

      if (mappedCategory) {

        if (mappedCategory.plaid1) {
          categoryArray.push(mappedCategory.plaid1);
        }
        if (mappedCategory.plaid2) {
          categoryArray.push(mappedCategory.plaid2);
        }
        if (mappedCategory.plaid3) {
          categoryArray.push(mappedCategory.plaid3);
        }

      }

      if (!mappedCategory && mint.category != 'Uncategorized') {
        console.log('Could not find category mapping for '+mint.category);
      }

      newTransaction.category = categoryArray;

      jsonArray.push(newTransaction);

    });

    jsonfile.writeFile(base + __dirname + filename, jsonArray, function (err) {
      if (err) {
        console.error(err)
      }
      else {
        console.log('File written successfully to '+ __dirname + filename);
      }

    })

  }
});


Meteor.startup(() => {

});
