import React from 'react';
import Card from './Card';

class Workers extends Card{
    render(){
        return (
            <div className="stats workers">
                { super.renderInfo(
                    <p>
                        Worker data pulled from miningpoolhub api. Hashrate is given by what was recorded.
                        You may see multiple workers despite only having one, which is normal.
                    </p>
                ) }
                <h2>Workers</h2>
                {   
                    this.props.workers.length > 0 ?
                    <div className="workers-list">
                    {
                        this.props.workers.map(({hashrate, username, coin}) => {
                            return (
                                <div key={`worker:${username}${coin}-div`} style={{borderTop: '1px solid #eee'}}>
                                    <p key={`worker:${username}${coin}-user`} > 
                                        Worker: {username}
                                    </p>
                                    <p key={`worker:${username}${coin}-algorithm`} > 
                                        Algorithm: {this.props.getProfit(coin, hashrate).algorithm} ({this.props.getName(coin)})
                                    </p>
                                    <p key={`worker:${username}${coin}-hashrate`} > 
                                        Hashrate: {`${this.props.readify(this.props.getUnit(hashrate).value)} ${this.props.getUnit(hashrate).unit}`}
                                    </p>
                                </div>
                            );
                        })
                    }
                    </div>
                    :
                    <p>Loading...</p>
                }
            </div>
        );
    }
}

export default Workers;