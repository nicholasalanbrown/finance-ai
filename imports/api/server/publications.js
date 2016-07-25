import { Meteor } from 'meteor/meteor';

import { Transactions } from '../transactions.js';
import { Charts } from '../charts.js';
import moment from 'moment';

Meteor.publish('transactionsPublication', function (chartId) {

  let chartDoc = Charts.findOne({_id: chartId});

  console.log(chartDoc);

  const startDate = moment(chartDoc.startDate);
  const endDate = moment(chartDoc.endDate);

  return Transactions.find({category: chartDoc.category, date: {$gte: startDate.startOf('day').toDate(), $lte: endDate.startOf('day').toDate()} });
});
