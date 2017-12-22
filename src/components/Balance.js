import React from 'react';

const Balance = (props) => (
    <div className="balance" >
        {
            !!props.sumTotal('total') ?
            <h3>
                Total: ${props.readify(props.sumTotal('total'))}
            </h3>
            :
            <h3>Loading...</h3>
        }
        {
            // props.pair()
            // .map(({coin, confirmed, unconfirmed, ae_unconfirmed, total, price}, index) => {
            //     return (
            //         price && 
            //         <div key={`balance-${index}`}>
            //             {props.getName(coin)}: ${(total * price).toFixed(2)}
            //         </div>
            //     );
            // })
        }
    </div>
);

export default Balance;