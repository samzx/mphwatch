import React from 'react';
import Balance from './Balance';

const Header = (props) => (
    <div className="header">
        <div className="container header-container">
            {
                // <div className="header-title" >
                //     <h2> Dashboard </h2>
                // </div>
            }
            <Balance
                pair={props.pair}
                readify={props.readify}
                getName={props.getName}
                sumTotal={props.sumTotal}
            />
        </div>
    </div>
);

export default Header;