import React from 'react';
import Header from './Header';
import Landing from './Landing';

const Sidebar = (props) => (
    <div className="sidebar" >
        <h1> Mining Pool Hub Stats </h1>
        <p>Consider bookmarking me for future use 😇</p>
        {
            // <p className="apikey">{ !props.error ? props.id : props.error}</p>
        }
        <h2> Auto Exchange Currency</h2>
        <select>
            <option value="DASH" key={"DASH"}> DASH</option>
        </select>
        <h2> Donations </h2>
        <h3> BTC </h3>
        <h3> ETH </h3>
        <h3> LTC </h3>
        <h3> DASH </h3>
    </div>
);

export default Sidebar;