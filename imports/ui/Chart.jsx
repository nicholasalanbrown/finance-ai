import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import ChartistGraph from 'react-chartist';
import { _ } from 'meteor/underscore';
import moment from 'moment';

export default class Chart extends Component {

  render() {

    let chartData = [];

    _.each(this.props.data, function (transaction) {
      let transactionMonth = moment(transaction.date).month();
      let transactionYear = moment(transaction.date).year();

      let existingObject = _.findWhere(chartData, {month: transactionMonth, year: transactionYear});
      if (existingObject) {
        let existingAmount = existingObject.amount;
        let newAmount = existingAmount + transaction.amount*-1;
        existingAmount = newAmount;
      }
      else {
        chartData.push({
          month: transactionMonth,
          year: transactionYear,
          amount: transaction.amount*-1
        })
      }
    })

    chartData.sort(function (x, y) {
        var n = x.year - y.year;
        if (n !== 0) {
            return n;
        }

        return x.month - y.month;
    });

    labels = [];

    _.each(chartData, function(object) {
      let date = moment().set({'month': object.month, 'year': object.year});
      labels.push(date.format('MMMM YY'));
    })

    let amounts = _.pluck(chartData, 'amount');

    const data = {
      labels: labels,
      series: [amounts]
    };

    console.log(data);

    const options = {
    };

    const type = 'Bar'

    return (
      <div>
        <ChartistGraph data={data} options={options} type={type} />
      </div>
    );
  }
}

Chart.propTypes = {
  data: React.PropTypes.array.isRequired,
};
