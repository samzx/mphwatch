import React from 'react';

const Earnings = (props) => (
    <div className="profit">
        <h2> Earnings </h2>
        {
            props.display ?
            <div style={{borderTop: '1px solid #eee'}} >
                <p key={`totalProfitDaily`}> Daily: ${`${props.readify(props.getTotalProfit())}`} </p>
                <p key={`totalProfitWeekly`}> Weekly: ${`${props.readify(props.getTotalProfit() * 7)}`} </p>
                <p key={`totalProfitMonthly`}> Monthly: ${`${props.readify(props.getTotalProfit() * 365 / 12 )}`} </p>
            </div>
            :
            <p>Loading...</p>
        }
    </div>
);

export default Earnings;