import React from 'react';
import Header from './Header';
import Landing from './Landing';

const Sidebar = (props) => (
    <div className="sidebar" >
        <h1> MPH Stats </h1>
        <h2> Mining Pool Hub Stats </h2>
        <h3>API Key</h3>
        {
            <textarea value={props.id} style={{width: '97%', height: '8rem', resize: 'none', borderColor: '#eee' }} />
            // <p className="apikey">{ !props.error ? props.id : props.error}</p>
        }
        <h2> Exchange Currency</h2>
        <select>
            <option value="DASH" key={"DASH"}> DASH</option>
        </select>
        <h2> Donations </h2>
        <ul>
            <li> BTC </li>
            <li> ETH </li>
            <li> LTC </li>
            <li> DASH </li>
        </ul>

        <p style={{borderTop:"1px solid #eee", paddingTop: "2rem"}}>
            Consider bookmarking me for future use 😇
        </p>
    </div>
);

export default Sidebar;