import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Charts = new Mongo.Collection('charts');

Charts.schema = new SimpleSchema({
  category: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
});

Charts.attachSchema(Charts.schema);
