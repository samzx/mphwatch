import React from 'react';

const Header = (props) => (
    <div>
        <h1> Mining Pool Hub Stats </h1>
        {
            !props.error && <h3>Your API key is</h3>
        }
        <p style={{overflowWrap: 'break-word', padding: '2rem'}}>{ !props.error ? props.id : props.error}</p>
        <p>Consider bookmarking me for future use 😇</p>
    </div>
);

export default Header;