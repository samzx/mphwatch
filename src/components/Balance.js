import React from 'react';

const Balance = (props) => (
    <div className="balance" >
        {
            !!props.sumTotal('total') ?
            <h2>
                Balance: ${props.readify(props.sumTotal('total'))}
            </h2>
            :
            <h2>Loading...</h2>
        }
    </div>
);

export default Balance;