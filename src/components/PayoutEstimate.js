import React from 'react'

class PayoutEstimate extends React.Component{

    timeBeforePayout = () => {
        return this.props.getRemainingTime(
            this.props.getRemaining() / this.props.getTotalProfit()
        );
    }

    render(){
        if(props.display){
            return (
                <div>
                    <p key={`totalTimeUntilPayout`}> Time until payout: {
                        this.timeBeforePayout().days
                    } days, {
                        this.timeBeforePayout().hours
                    }  hours </p>
                    <p> Payout Amount: ${this.props.readify(this.props.getMinPayout())}</p>
                </div>
            );
        }
    }
}

export default PayoutEstimate;