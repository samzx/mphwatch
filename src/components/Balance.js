import React from 'react';

const Balance = (props) => (
    <div className="balance" >
        {
            <h2>
            Balance:
                {
                    !!props.sumTotal('total') &&
                    " $" + props.readify(props.sumTotal('total'))
                }
            </h2>
        }
    </div>
);

export default Balance;