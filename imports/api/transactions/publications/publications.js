import { Meteor } from 'meteor/meteor';

import { Transactions } from '../transactions.js';

Meteor.publish('todos', function todosPublication() {
  return Transactions.find();
});
