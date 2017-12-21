import React from 'react';

const Balance = (props) => (
    <div>
        {
            <h2>
                Total: ${props.readify(props.sumTotal('total'))}
            </h2>
        }
        {
            props.pair()
            .map(({coin, confirmed, unconfirmed, ae_unconfirmed, total, price}, index) => {
                return (
                    <div key={`balance-${index}`}>
                        {props.getName(coin)}: ${(total * price).toFixed(2)}
                    </div>
                );
            })
        }
    </div>
);

export default Balance;