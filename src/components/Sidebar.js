import React from 'react';
import Header from './Header';
import Landing from './Landing';

class Sidebar extends React.Component{

    state = {
        showapi: false,
        showexchange: false,
        showdonation: false,
        showmore: false,
    }

    render(){
        return (
            <div className="sidebar" >
                <h1> MPH Stats </h1>
                <div className="sidebar-contents">
                    <div>
                        <h3> API Key </h3>
                        <a onClick={() => {this.setState((prevState) => ({showapi: !prevState.showapi}))}} > Show </a>
                        {
                            this.state.showapi && 
                            <div>
                                <p className="wrap">{ !this.props.error ? this.props.id : this.props.error}</p>
                                <a href="/" >Change API Key</a>
                            </div>
                        }
                    </div>
        
                    <div>
                        <h3> Exchange Currency </h3>
                        <a onClick={() => {this.setState((prevState) => ({showexchange: !prevState.showexchange}))}} > Show </a>
                        {
                            this.state.showexchange && 
                            <select>
                                <option value="DASH" key={"DASH"}> Auto detect (max holding)</option>
                            </select>
                        }
                    </div>
                    <div>
                        <h3> BTC Donation </h3>
                        <a onClick={() => {this.setState((prevState) => ({showdonation: !prevState.showdonation}))}} > Show </a>
                        {
                            this.state.showdonation && 
                            <div>
                                <p className="wrap" >3A9XhUksxvFf315ZZbzvTq6JeVtVYr7Xgv</p>
                                <img src='https://chart.googleapis.com/chart?cht=qr&chl=3A9XhUksxvFf315ZZbzvTq6JeVtVYr7Xgv&chs=180x180&choe=UTF-8&chld=L|2' alt='' />
                            </div>
                        }
                    </div>
                    <div>
                        <h3> More </h3>
                        <a onClick={() => {this.setState((prevState) => ({showmore: !prevState.showmore}))}} > Show </a>
                        {
                            this.state.showmore && 
                            <div>
                                <p> This project is <a href="https://github.com/solexstudios/mphstats">open source</a> and made with ♥ </p>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default Sidebar;