import React from 'react';
import { HorizontalBar } from 'react-chartjs-2';
import Chart from './Chart';

class Progress extends Chart{

    getPercentage = () => {
        const percent = (this.props.sumTotal('total') / this.props.getMinPayout() * 100);
        return percent > 100 ? 100 : percent;
    }

    getProgressBarData = () => (
        {
            datasets:[
                {
                    label: 'Confirmed',
                    data: [this.props.readify(this.props.sumTotal('confirmed')/ this.props.getMinPayout()*100)],
                    backgroundColor: this.props.backgroundColor.confirmed
                },
                {
                    label: 'On Exchange',
                    data: [this.props.readify(this.props.sumTotal('exchange')/ this.props.getMinPayout()*100)],
                    backgroundColor: this.props.backgroundColor.exchange
                },
                {
                    label: 'Unconfirmed',
                    data: [this.props.readify(this.props.sumTotal('unconfirmed')/ this.props.getMinPayout()*100)],
                    backgroundColor: this.props.backgroundColor.unconfirmed
                },
                {
                    label: 'Remaining',
                    data: [this.props.readify(this.props.getRemaining()/ this.props.getMinPayout()*100)],
                }
            ],
            labels: []
        }
    );

    getProgressBarOptions = () => (
        {
            tooltips:{
                enabled: false
            },
            legend: {
                display: false,
            },
            scales: {
                xAxes: [{
                    stacked: true,
                    ticks: {
                        beginAtZero: true,
                        max: 100
                    },
                }],
                yAxes: [{
                    maxbarThickness: 50,
                    stacked: true,
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            events: [],
            animation: {
                duration: this.props.duration
            }
        }
    );

    render(){
        return (
            <div className="progress">
                { super.renderInfo(
                    <p>
                        Shows your progress until payout. By default this is set as your balance
                        as a percentage of the minimum payout of your largest holding. Payout percentage
                        is based on the total balance of your account, and assumes coins on auto-exchange are
                        exchanged immediately. Light tint represents coins that are being exchanged, while the
                        darker tint represents confirmed balances.
                    </p>
                ) }
                <h2> 
                    {"Payout Progress: "}
                    { !!this.getPercentage() && (this.getPercentage().toFixed(1) + "%")} 
                </h2>
                <HorizontalBar
                    height={document.body.clientWidth > 480 ? 15 : 40}
                    data={this.getProgressBarData()}
                    options={this.getProgressBarOptions()}
                    redraw={this.state.redraw}
                />
              </div>
        );
    }
}

export default Progress;