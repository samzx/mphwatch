import React from 'react';
import { Pie } from 'react-chartjs-2';

class Distribution extends React.Component{

    getDistributionData = () => {
        const pairs = this.props.pair();
        let data = { 
            datasets: [
                { 
                    data: pairs.map((pair) => (pair.price * this.props.get24hr(pair.coin)).toFixed(2)),
                    backgroundColor: pairs.map((pair) => this.props.getColor(pair.coin))
                }],
            labels: pairs.map((pair) => this.props.getName(pair.coin))
        };
        return data;
    }

    getDistributionOptions = () => (
        {
            responsive: true,
            tooltips: {
                callbacks: {
                    title: (tooltipItem, chart) => {return 'Dollar Value'},
                    afterLabel: (tooltipItem, chart) => {"yes"}
                },
            }
        }
    );

    render(){
        return (
            <div className="charts" >
                <h1> 24 Hour Credit Distribution</h1>

                <Pie
                    width={640}
                    height={480}
                    data={this.getDistributionData()}
                    options = {this.getDistributionOptions()}
                />

            </div>
        );
    }
}

export default Distribution;