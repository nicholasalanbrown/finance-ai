import { Meteor } from 'meteor/meteor';
let Future = Npm.require( 'fibers/future' );
import { _ } from 'meteor/underscore';
import moment from 'moment';
import numeral from 'numeral';
import math from 'mathjs';

import { Transactions } from './transactions.js';
import { Charts } from './charts.js';
let currentDate = moment();

formatCurrency = (number) => numeral(number).format('$0,0.00');

Meteor.methods({
  getBalance() {
    console.log('Getting balance...');
    return {
      speech: 'Your credit card balance is currently $295',
      displayText: 'Your credit card balance is currently $295',
      data: {},
      contextOut: [],
    }
  },
  getTransactionsOnDate(date) {
    console.log('Getting transactions on a specific date..');
    let speech = '';
    let requestDate = moment(date);

    //If the request year is after the current year, set it back to the current year
    currentDate < requestDate ? requestDate.year(currentDate.year()) : null;

    let docArray = Transactions.find({date: {$gte: requestDate.startOf('day').toDate(), $lte: requestDate.startOf('day').toDate()} }, {sort: {date: 1}, limit: 5}).fetch();

    if (docArray.length == 0) {
      speech = "Sorry, I couldn't find any transactions in that date range";
    }

    else {
      speech = 'I found these transactions for that date range: \n';
      _.each(docArray, function(doc, index) {
        let amountPrefix;
        doc.type == 'debit' ? amountPrefix = '-' : amountPrefix = '+';
        speech += moment(doc.date).format('MM-DD-YYYY')+ ' '+doc.description+' '+ amountPrefix + formatCurrency(doc.amount);
        if (index < docArray.length-1) {
          speech += '\n';
        }
      });
    }

    console.log(speech);

    return {
      speech: speech,
      displayText: speech,
      data: {},
      contextOut: [],
    };
  },
  getTransactionsBetweenDates(datePeriod) {
    console.log('Getting transactions over a date period...');
    let speech = '';
    let startDate = moment(datePeriod.startDate.rfcString);
    let endDate = moment(datePeriod.endDate.rfcString);

    //If the request year is after the current year, set it back to the current year
    currentDate < startDate ? startDate.year(currentDate.year()) : null;
    currentDate < endDate ? endDate.year(currentDate.year()) : null;

    let docArray = Transactions.find({date: {$gte: startDate.startOf('day').toDate(), $lte: endDate.startOf('day').toDate()} }, {sort: {date: 1}, limit: 5}).fetch();

    if (docArray.length == 0) {
      speech = "Sorry, I couldn't find any transactions in that date range";
    }

    else {
      speech = 'I found these transactions for that date range: \n';
      _.each(docArray, function(doc, index) {
        let amountPrefix;
        doc.type == 'debit' ? amountPrefix = '-' : amountPrefix = '+';
        speech += moment(doc.date).format('MM-DD-YYYY')+ ' '+doc.description+' '+ amountPrefix + formatCurrency(doc.amount);
        if (index < docArray.length-1) {
          speech += '\n';
        }
      });
    }

    console.log(speech);

    return {
      speech: speech,
      displayText: speech,
      data: {},
      contextOut: [],
    };
  },

  getSpending(category, datePeriod) {
    console.log('Getting spending...')
    let speech = '';
    let startDate = moment(datePeriod.startDate.rfcString);
    let endDate = moment(datePeriod.endDate.rfcString);

    //If the request year is after the current year, set it back to the current year
    currentDate < startDate ? startDate.year(currentDate.year()) : null;
    currentDate < endDate ? endDate.year(currentDate.year()) : null;

    let docArray = Transactions.find({category: category, date: {$gte: startDate.startOf('day').toDate(), $lte: endDate.startOf('day').toDate()} }).fetch();

    if (docArray.length == 0) {
      speech = "Sorry, I couldn't find any transactions in that date range";
    }

    else {
      const amounts = _.pluck(docArray, 'amount');
      const sum = formatCurrency(-1*math.sum(amounts));
      let transactionNoun = docArray.length > 1 ? 'transactions' : 'transaction';
      speech = 'I found ' + docArray.length +' '+ transactionNoun +' for '+ category.toLowerCase() +', totalling ' + sum;
    }

    console.log(speech);

    return {
      speech: speech,
      displayText: speech,
      data: {},
      contextOut: [],
    };
  },

  graphSpending (category, datePeriod) {
    console.log('Generating spending graph...')
    let speech = '';
    let currentDate = moment();
    console.log(currentDate.format());
    let startDate = moment(datePeriod.startDate.rfcString);
    let endDate = moment(datePeriod.endDate.rfcString);

    //If the request year is after the current year, set it back to the current year
    currentDate < startDate ? startDate.year(currentDate.year()) : null;
    currentDate < endDate ? endDate.year(currentDate.year()) : null;

    startDate = startDate.format();
    endDate = endDate.format();

    let future = new Future();

    Charts.insert({category: category, startDate: startDate, endDate: endDate}, function( error, id ) {
      if ( error ) {
        future.return( error );
      } else {
        future.return( id );
      }
    });

    chartDoc = future.wait();

    const chartUrl = `${Meteor.absoluteUrl()}charts/${chartDoc}`;
    speech = `I've created a chart for you here: ${chartUrl}`

    return {
      speech: speech,
      displayText: speech,
      data: {},
      contextOut: [],
    };

  },

  webhook(response) {
    console.log('Api.ai requests '+ response.result.action + ' action, running matching method...');
    let calledFunction;
    switch (response.result.action) {
      case 'getTransactions':
        if (response.result.parameters.date) {
          calledFunction = Meteor.call('getTransactionsOnDate', response.result.parameters.date.rfcString);
        }
        else if (response.result.parameters['date-period']) {
          calledFunction = Meteor.call('getTransactionsBetweenDates', response.result.parameters['date-period']);
        }
        break;
      case 'getSpending':
        calledFunction = Meteor.call('getSpending', response.result.parameters.category, response.result.parameters['date-period'])
        break;
      case 'graphSpending':
        calledFunction = Meteor.call('graphSpending', response.result.parameters.category, response.result.parameters['date-period'])
        break;
      case 'getBalance':
        calledFunction = Meteor.call('getBalance');
        break;
      default:
        calledFunction = {
          speech: "Sorry, I couldn't find a function associated with that intent",
          displayText: "Sorry, I couldn't find a function associated with that intent",
          data: {},
          contextOut: [],
        };
    }
    return calledFunction;
  },
})
