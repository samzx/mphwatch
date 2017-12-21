import React from 'react';

const Workers = (props) => (
    <div>
        {            
            props.workers.map(({hashrate, username, coin}) => {
                return (
                    <div key={`worker:${username}${coin}-div`}>
                        <p key={`worker:${username}${coin}-user`} > 
                            {username}
                        </p>
                        <p key={`worker:${username}${coin}-algorithm`} > 
                            {props.getProfit(coin, hashrate).algorithm}
                        </p>
                        <p key={`worker:${username}${coin}-name`} > 
                            {props.getName(coin)}
                        </p>
                        <p key={`worker:${username}${coin}-hashrate`} > 
                            {`${props.readify(props.getUnit(hashrate).value)} ${props.getUnit(hashrate).unit}`}
                        </p>
                    </div>
                );
            })
        }
    </div>
);

export default Workers;