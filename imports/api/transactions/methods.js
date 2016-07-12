import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import moment from 'moment';

import { Transactions } from './transactions.js';
import { History } from '../history/history.js';


Meteor.methods({
  getBalance() {
    console.log('Getting balance...');
    return {
      speech: 'Your checking account balance is $500',
      displayText: 'Your checking account balance is $500',
      data: {},
      contextOut: [],
    }
  },
  getTransactionsOnDate(date) {
    let speech = '';
    let currentDate = moment();
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
        speech += moment(doc.date).format('MM-DD-YYYY')+ ' '+doc.description+' '+ amountPrefix +'$'+doc.amount;
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
    let speech = '';
    let currentDate = moment();
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
        speech += moment(doc.date).format('MM-DD-YYYY')+ ' '+doc.description+' '+ amountPrefix +'$'+doc.amount;
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
  getSpending () {
    console.log('Getting spending...');
    return "Here's your spending";
  },
  webhook(response) {
    console.log('Running webhook method...');
    console.log(response);
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
      case 'getSpendingf':
        calledFunction = Meteor.call('getSpending')
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

/*

Meteor.methods({
  getBalance() {
    return {
      speech: 'Your checking account balance is $500',
      displayText: 'Your checking account balance is $500',
      data: {},
      contextOut: [],
    };
  },
  getSpending(category, start, end) {
    console.log(category, start, end);
    return {
      speech: 'getSpending',
      displayText: 'getSpending',
      data: {},
      contextOut: [],
    };
  },
  getTransactions(date) {
    let convertedDate = moment(date).format();
    console.log(convertedDate);
    return {
      speech: 'getTransactions',
      displayText: 'getTransactions',
      data: {},
      contextOut: [],
    };
  },
  webhook(response) {
    console.log(response);
    History.insert(response);
    let calledFunction;
    switch (response.result.action) {
      case 'getTransactions':
        const dateExists = (response, result, paramaters, date, calendar) => {
          const args = Array.prototype.slice.call(arguments, 1);
          for (var i = 0; i < args.length; i++) {
            if (!obj || !obj.hasOwnProperty(args[i])) {
              return false;
            }
            obj = obj[args[i]];
          }
          return true;
        }
        if (dateExists) {
          calledFunction = Meteor.call('getTransactions', result.paramaters.date.calendar);
        }
        break;
      case 'getSpendingf':
        calledFunction = Meteor.call('getSpending')
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
});

*/
