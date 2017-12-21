import React from 'react';

const Workers = (props) => (
    props.workers.map(({hashrate, username, coin}) => {
        return (
            <div key={`worker:${username}${coin}-div`}>
                <p key={`worker:${username}${coin}-hash`} > 
                    {username} :
                    {props.getProfit(coin, hashrate).algorithm} :
                    {props.getName(coin)} :
                    {`${props.readify(props.getUnit(hashrate).value)} ${props.getUnit(hashrate).unit}`}
                </p>
            </div>
        );
    })
);

export default Workers;