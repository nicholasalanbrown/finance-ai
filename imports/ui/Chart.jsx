import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import ChartistGraph from 'react-chartist';
import { _ } from 'meteor/underscore';

export default class Chart extends Component {

  render() {

    const amounts = _.pluck(this.props.data, 'amount');
    const series = _.map(amounts, function(amount) {
      return amount*-1;
    });
    const data = {
      labels: series,
      series: [series]
    };
    console.log(data);

    const options = {
      high: 100,
      low: 0
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
