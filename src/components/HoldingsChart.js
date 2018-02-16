import React from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from './Chart';

class HoldingsChart extends Chart{

    getBarData = () => {
        const pairs = this.props.pair();
        let data = {
            datasets:[
                {
                    label: 'Confirmed',
                    data: pairs.map((pair) => this.props.readify(pair.confirmed * pair.price, this.props.conversion.decimals)) ,
                    backgroundColor: this.props.backgroundColor.confirmed
                },
                {
                    label: 'On exchange',
                    data: pairs.map((pair) => this.props.readify(pair.ae_unconfirmed * pair.price, this.props.conversion.decimals)),
                    backgroundColor: this.props.backgroundColor.exchange
                },
                {
                    label: 'Unconfirmed',
                    data: pairs.map((pair) => this.props.readify(pair.unconfirmed * pair.price, this.props.conversion.decimals)),
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
            },
            animation: {
                duration: this.props.duration
            }
        }
    );

    render(){
        return (
            <div className="holdings charts" >
                { super.renderInfo(
                    <p>
                        Balances of each coin are shown here. Coins on exchange are subject up to days
                        before being successfully exchanged, so please be patient. You can click on the labels
                        to exclude a given coin.
                    </p>
                ) }
                <h2>Holdings</h2>
                <Bar
                    data={this.getBarData()}
                    options = {this.getBarOptions()}
                    redraw={this.state.redraw}
                />

            </div>
        );
    }
}

export default HoldingsChart;