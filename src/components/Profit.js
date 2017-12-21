import React from 'react';

const Profit = (props) => (
    // props.display && 
    <div>
        <h2 key={`totalProfitDaily`}> Total Daily: ${`${props.readify(props.getTotalProfit())}`} </h2>
        <h3 key={`totalProfitWeekly`}> Total Weekly: ${`${props.readify(props.getTotalProfit() * 7)}`} </h3>
        <h3 key={`totalProfitMonthly`}> Total Monthly: ${`${props.readify(props.getTotalProfit() * 365 / 12 )}`} </h3>
    </div>
);

export default Profit;