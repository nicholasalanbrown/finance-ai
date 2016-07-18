import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Transactions = new Mongo.Collection('transactions');

/*

Transactions.schema = new SimpleSchema({
  _account: {
    type: String,
  },
  amount: {
    type: Number,
    deciimal: true,
  },
  date: {
    type: Date,
  },
  name: {
    type: String,
  },
  meta: {
    type: Object
  },
  pending: {
    type: Boolean
  }
});

Transactions.attachSchema(Transactions.schema);

*/
