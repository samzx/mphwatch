import React from 'react';
import { Bar } from 'react-chartjs-2';

class HoldingsChart extends React.Component{

    getBarOptions = () => (
        {
            title: {
                display: true,
                text: 'Dollar Value (USD)',
                position: 'top'
            },
            responsive: true,
            scales: {
                xAxes: [{
                    scaleLabel: {
                        labelString: 'Dollar Value (USD)',
                        display: true
                    },
                    stacked: true,
                    ticks: {
                        beginAtZero: true
                    }
                }],
                yAxes: [{
                    stacked: true,
                    ticks: {
                        beginAtZero: true
                    },
                }]
            }
        }
    );

    getBarData = () => {
        const pairs = this.props.pair();
        // console.log(pairs);
        let data = {
            datasets:[
                {
                    // Confirmed
                    label: 'Confirmed',
                    data: pairs.map((pair) => this.props.readify(pair.confirmed * pair.price)) ,
                    backgroundColor: this.props.backgroundColor.confirmed
                },
                {
                    // On exchange
                    label: 'On exchange',
                    data: pairs.map((pair) => this.props.readify(pair.ae_unconfirmed * pair.price)),
                    backgroundColor: this.props.backgroundColor.exchange
                },
                {
                    // Unconfirmed
                    label: 'Unconfirmed',
                    data: pairs.map((pair) => this.props.readify(pair.unconfirmed * pair.price)),
                    backgroundColor: this.props.backgroundColor.unconfirmed
                },
            ],
            labels: pairs.map((pair) => this.props.getName(pair.coin))
        }
        return data;
    }

    render(){
        return (
            <div className="charts" >
                <h1>Holdings</h1>
                <Bar
                    data={this.getBarData()}
                    width={640}
                    height={480}
                    options = {this.getBarOptions()}
                />

            </div>
        );
    }
}

export default HoldingsChart;