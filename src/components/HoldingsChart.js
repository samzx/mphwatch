import React from 'react';
import { Bar } from 'react-chartjs-2';
import Card from './Card';

class HoldingsChart extends Card{

    getBarData = () => {
        const pairs = this.props.pair();
        // console.log(pairs);
        let data = {
            datasets:[
                {
                    // Confirmed
                    label: 'Confirmed',
                    data: pairs.map((pair) => this.props.readify(pair.confirmed * pair.price, this.props.conversion.decimals)) ,
                    backgroundColor: this.props.backgroundColor.confirmed
                },
                {
                    // On exchange
                    label: 'On exchange',
                    data: pairs.map((pair) => this.props.readify(pair.ae_unconfirmed * pair.price, this.props.conversion.decimals)),
                    backgroundColor: this.props.backgroundColor.exchange
                },
                {
                    // Unconfirmed
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
                />

            </div>
        );
    }
}

export default HoldingsChart;