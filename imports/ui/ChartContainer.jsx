import { Meteor } from 'meteor/meteor';
import { Transactions } from '../api/transactions.js';
import { createContainer } from 'meteor/react-meteor-data';
import Chart from './Chart.jsx';

export default ChartContainer = createContainer(({params}) => {

  const chartId = params.id;
  const transactionsHandle = Meteor.subscribe('transactionsPublication', chartId);
  const loading = !transactionsHandle.ready();
  const data = Transactions.find().fetch();
  const dataExists = !loading && !!data;
  return {
    loading,
    dataExists,
    data: dataExists ? data : [],
  };
}, Chart);
