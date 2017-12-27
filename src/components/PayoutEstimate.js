import React from 'react'
import Card from './Card';

class PayoutEstimate extends Card{

    timeBeforePayout = () => {
        return this.props.getRemainingTime(
            this.props.getRemaining() / this.props.getTotalProfit()
        );
    }

    render(){
        return (
            <div className="stats payout" >
                { super.renderInfo(
                    <p>
                        Estimations are based on daily earnings until payout. You can select a different
                        currency and payout amount in the settings section under the menu.
                    </p>
                )}
                <h2> Payout </h2>
                {
                    this.props.display ?
                    <div style={{borderTop: '1px solid #eee'}} >
                        <p key={`totalTimeUntilPayout`}> 
                            {"Remaining: "}
                            { this.timeBeforePayout().days } { this.timeBeforePayout().days == 1 ? " day, " : " days, "} 
                            { this.timeBeforePayout().hours + " hours" } 
                        </p>
                        <p> Amount: ${this.props.readify(this.props.getMinPayout())}</p>
                        <p> Payment: {this.props.getPrimaryCoin() && this.props.getName(this.props.getPrimaryCoin().coin)} </p>
                    </div>
                    :
                    <p>Loading...</p>
                }
            </div>
        );
    }
}

export default PayoutEstimate;