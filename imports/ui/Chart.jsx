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

    console.log(chartData);

    chartData.sort(function (x, y) {
        var n = x.year - y.year;
        if (n !== 0) {
            return n;
        }

        return x.month - y.month;
    });

    console.log(chartData);

    const amounts = _.pluck(this.props.data, 'amount');
    const dates = _.pluck(this.props.data, 'date');
    const labels = _.map(dates, function (date) {
      return moment(date).format('MMMM Do');
    });
    const series = _.map(amounts, function(amount) {
      return amount*-1;
    });

    console.log(labels);
    const data = {
      labels: labels,
      series: [series]
    };

    console.log(data);

    let axisLabels = [];

    const options = {
      showLine: false,
      axisX: {
        labelInterpolationFnc: function(value) {
          let weekStart = moment(value).startOf('week')
        }
      }
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
