import React from 'react';
import { HorizontalBar } from 'react-chartjs-2';

class Progress extends React.Component{

    getPercentage = () => {
        return (this.props.sumTotal('total') / this.props.getMinPayout() * 100);
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
            // events: [],
        }
    );

    render(){
        return (
            <div className="progress">
                {
                    
                    <div>
                        <h2> 
                            {"Payout Progress: "}
                            { !!this.getPercentage() && (this.getPercentage().toFixed(1) + "%")} 
                        </h2>
                        <HorizontalBar
                            height={document.body.clientWidth > 480 ? 15 : 40}
                            data={this.getProgressBarData()}
                            options={this.getProgressBarOptions()}
                        />
                    </div>
                }
              </div>
        );
    }
}

export default Progress;