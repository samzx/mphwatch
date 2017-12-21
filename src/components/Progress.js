import React from 'react';
import { HorizontalBar } from 'react-chartjs-2';

class Progress extends React.Component{

    getProgressBarData = () => (
        {
            datasets:[
                {
                    label: 'Confirmed',
                    data: [this.props.readify(this.props.sumTotal('confirmed')/ this.props.getMinPayout()*100)],
                    backgroundColor: 'green'
                },
                {
                    label: 'On Exchange',
                    data: [this.props.readify(this.props.sumTotal('exchange')/ this.props.getMinPayout()*100)],
                    backgroundColor: 'orange'
                },
                {
                    label: 'Unconfirmed',
                    data: [this.props.readify(this.props.sumTotal('unconfirmed')/ this.props.getMinPayout()*100)],
                    backgroundColor: 'red'
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
                display: true,
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
                    stacked: true,
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            events: [],
            hover: {
                
            }
        }
    );

    render(){
        return (
            <div>
                <div className="charts" >
                    <h1> Payout Progress {} </h1>
        
                    <HorizontalBar
                        height={80}
                        data={this.getProgressBarData()}
                        options={this.getProgressBarOptions()}
                    />
                </div>
            </div>
        );
    }
}

export default Progress;