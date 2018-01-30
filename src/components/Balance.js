import React from 'react';

const Balance = (props) => (
    <div className="balance" >
        {
            <h2>
            Balance:
                {
                    !!props.sumTotal('total') &&
                    ` ${props.conversion.pre}` + props.readify(props.sumTotal('total'), props.conversion.decimals) + ` ${props.conversion.post}`
                }
            </h2>
        }
    </div>
);

export default Balance;