import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import ChartistGraph from 'react-chartist';
import { _ } from 'meteor/underscore';
import moment from 'moment';

export default class Chart extends Component {

  render() {

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

    const options = {
      showLine: false
    };

    const type = 'Line'

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
