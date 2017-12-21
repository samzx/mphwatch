import React from 'react';

const Header = (props) => (
    <div>
        <h1> Mining Pool Hub Stats </h1>
        {
            !props.error && <h3>Your API key is</h3>
        }
        <p style={{overflowWrap: 'break-word'}}>{ !props.error ? props.id : props.error}</p>
        <h3>Consider bookmarking me for future use 😇</h3>
    </div>
);

export default Header;