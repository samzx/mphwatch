import React from 'react';
import { Bar } from 'react-chartjs-2';

class HoldingsChart extends React.Component{

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

    getBarOptions = () => (
        {
            title: {
                display: false,
                text: 'Dollar Value (USD)',
                position: 'top'
            },
            // responsive: false,
            // maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    scaleLabel: {
                        labelString: 'Dollar Value (USD)',
                        display: false
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

    render(){
        return (
            <div className="holdings charts" >
                <h2>Holdings</h2>
                <Bar
                    data={this.getBarData()}
                    // width={document.body.clientWidth > 480? 480 : 300}
                    // height={document.body.clientHeight > 480 ? 240 : 240}
                    options = {this.getBarOptions()}
                />

            </div>
        );
    }
}

export default HoldingsChart;