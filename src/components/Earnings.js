import React from 'react';
import Card from './Card';

class Earnings extends Card{
    render(){
        return (
            <div className="stats profit">
                { super.renderInfo( 
                    <p>
                        Earnings are estimated on your current hashrate, as a share of the total
                        hashrate of a cryptocurrency. Note that this is merely estimates and real 
                        returns are subject to the probability of rewards from a block.
                    </p>
                ) }
                <h2> Earnings </h2>
                {
                    this.props.display ?
                    <div style={{borderTop: '1px solid #eee'}} >
                        <p key={`totalProfitDaily`}> Daily: {this.props.conversion.pre}{`${this.props.readify(this.props.getTotalProfit(), this.props.conversion.decimals)}`} </p>
                        <p key={`totalProfitWeekly`}> Weekly: {this.props.conversion.pre}{`${this.props.readify(this.props.getTotalProfit() * 7, this.props.conversion.decimals)}`} </p>
                        <p key={`totalProfitMonthly`}> Monthly: {this.props.conversion.pre}{`${this.props.readify(this.props.getTotalProfit() * 365 / 12, this.props.conversion.decimals)}`} </p>
                    </div>
                    :
                    <p>Loading...</p>
                }
            </div>
        );
    }
}

export default Earnings;