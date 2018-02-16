import React from 'react';
import { Pie, Doughnut } from 'react-chartjs-2';
import Card from './Card';

class Distribution extends Card{

    getDistributionData = () => {
        const pairs = this.props.pair();
        let data = { 
            datasets: [
                { 
                    data: pairs
                        .sort((a,b) => (this.props.get24hr(b.coin) * b.price - this.props.get24hr(a.coin) * a.price))
                        .map((pair) => this.props.readify(pair.price * this.props.get24hr(pair.coin), this.props.conversion.decimals)),
                    backgroundColor: pairs.map((pair) => this.props.getColor(pair.coin))
                }],
            labels: pairs.map((pair) => this.props.getName(pair.coin))
        };
        return data;
    }

    getDistributionOptions = () => (
        {
            tooltips: {
                callbacks: {
                    title: (tooltipItem, chart) => {return 'Amount credited'},
                    afterLabel: (tooltipItem, chart) => {"yes"}
                },
            }
        }
    );

    render(){
        return (
            <div className="distribution charts" >
                { super.renderInfo(
                    <p>
                        Distribution of coins are merely what has been credited to your wallet and
                        does not include debits from auto exchange. That is it only accounts for what
                        was given to you, not the net value.
                    </p>
                ) }
                <h2> 24 Hour Credit Distribution</h2>
                <Pie
                    data={this.getDistributionData()}
                    options = {this.getDistributionOptions()}
                />

            </div>
        );
    }
}

export default Distribution;