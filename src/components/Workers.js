import React from 'react';

const Workers = (props) => (
    <div className="workers">
        <h2>Workers</h2>
        {   
            props.workers.length > 0 ?         
            props.workers.map(({hashrate, username, coin}) => {
                return (
                    <div key={`worker:${username}${coin}-div`} style={{borderTop: '1px solid #eee'}}>
                        <p key={`worker:${username}${coin}-user`} > 
                            Worker: {username}
                        </p>
                        <p key={`worker:${username}${coin}-algorithm`} > 
                            Algorithm: {props.getProfit(coin, hashrate).algorithm} ({props.getName(coin)})
                        </p>
                        <p key={`worker:${username}${coin}-hashrate`} > 
                            Hashrate: {`${props.readify(props.getUnit(hashrate).value)} ${props.getUnit(hashrate).unit}`}
                        </p>
                    </div>
                );
            })
            :
            <p>Loading...</p>
        }
    </div>
);

export default Workers;