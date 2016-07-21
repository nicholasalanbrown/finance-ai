import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Transactions = new Mongo.Collection('transactions');


Transactions.schema = new SimpleSchema({
  date: {
    type: Date,
  },
  description: {
    type: String,
  },
  original_description: {
    type: String,
  },
  amount: {
    type: Number,
    decimal: true
  },
  category: {
    type: String,
  },
});

Transactions.attachSchema(Transactions.schema);
