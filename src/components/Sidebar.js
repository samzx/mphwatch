import React from 'react';
import Header from './Header';
import Landing from './Landing';

class Sidebar extends React.Component{

    state = {
        showAbout: false,
        showApi: false,
        showSettings: false,
        showDonation: '',
        showMore: false,
        payout: JSON.parse(localStorage.getItem("custom")) ? "custom" : "autopay",
    }

    handleCustomInput = (e) => {
        let amount = e.target.value;
        amount = amount > 0 ? amount : 0;
        this.props.setMinPayOut(amount);
        localStorage.setItem("payout", amount);
    }

    removeLeadingZero = (text) => {
        if(!text.includes(".")){
            return text.replace(/^0+/, '');
        }
        return text;
    }

    getDonation = (donation) => {
        switch(donation){
            case 'btc':
                return (
                    <div>
                        <p className="wrap" >3A9XhUksxvFf315ZZbzvTq6JeVtVYr7Xgv</p>
                        <img src='https://chart.googleapis.com/chart?cht=qr&chl=3A9XhUksxvFf315ZZbzvTq6JeVtVYr7Xgv&chs=180x180&choe=UTF-8&chld=L|2' alt='' />
                    </div>
                );
            case 'ltc':
                return (
                    <div>
                        <p className="wrap" >Le2q2AP857474Zh9cocy3wsfJQtj6rdSb5</p>
                        <img src='https://chart.googleapis.com/chart?cht=qr&chl=Le2q2AP857474Zh9cocy3wsfJQtj6rdSb5&chs=180x180&choe=UTF-8&chld=L|2' alt='' />
                    </div>
                );
            case 'eth':
                return (
                    <div>
                        <p className="wrap" >0x1fab1c7dcae109e9367d4e07d85494e819fb2c0d</p>
                        <img src='https://chart.googleapis.com/chart?cht=qr&chl=0x1fab1c7dcae109e9367d4e07d85494e819fb2c0d&chs=180x180&choe=UTF-8&chld=L|2' alt='' />
                    </div>
                );
            default:
                return undefined;
        }
    }

    // TODO: Seperate into different components
    render(){
        return (
            <div className="sidebar" >
                <h1> MPH Watch </h1>
                <div className="sidebar-contents">
                    <div className="sidebar-item" >
                        <h3> About </h3>
                        <a onClick={() => {this.setState((prevState) => ({showAbout: !prevState.showAbout}))}} > 
                            {this.state.showAbout ? "Hide" : "Show"} 
                        </a>
                    </div>
                        {
                            this.state.showAbout && 
                            <div className="sidebar-details" >
                                <p> Prices are sourced from coinmarketcap.com, hash rates from whattomine.com and your mining data from miningpoolhub.com api. 
                                    Note that sometimes miningpoolhub api does not show worker data, therefore derived data such as daily earnings estimate does not appear.
                                </p>
                            </div>
                        }
                    <div className="sidebar-item" >
                        <h3> API Key </h3>
                        <a onClick={() => {this.setState((prevState) => ({showApi: !prevState.showApi}))}} > 
                            {this.state.showApi ? "Hide" : "Show"} 
                        </a>
                    </div>
                        {
                            this.state.showApi && 
                            <div className="sidebar-details" >
                                <p className="wrap">{ !this.props.error ? this.props.id : this.props.error}</p>
                                <a href="/" >Change API Key</a>
                            </div>
                        }
                    
                        
                        <div className="sidebar-item" >
                            <h3> Settings </h3>
                            <a onClick={() => {this.setState((prevState) => ({showSettings: !prevState.showSettings}))}} > 
                                {this.state.showSettings ? "Hide" : "Show"} 
                            </a>
                        </div>
                        {
                            this.state.showSettings &&
                            <div className="sidebar-details" > 


                                <h4>Currency display</h4>
                                <select
                                    onChange={(e) => {
                                        const option = e.target.value.toLowerCase();
                                        this.props.setConversion(option);
                                        localStorage.setItem("conversion", option);
                                    }}
                                    defaultValue={this.props.conversion}
                                >
                                    {
                                        Object.keys(this.props.conversions).map((ticker) => {
                                            return (
                                                <option value={ticker} key={`curdisp-${ticker}`}> {ticker.toUpperCase()} </option>
                                            );
                                        })
                                    }
                                </select>


                                <h4>Auto Exchange Currency</h4>
                                <select
                                    onChange={(e) => {
                                        const option = e.target.value;
                                        this.props.setAeCurrency(option);
                                        localStorage.setItem("ae_currency", option);
                                    }}
                                    defaultValue={this.state.ae_currency}
                                >
                                    <option value="auto" key={"autoex-auto"}> Largest holding</option>
                                    {
                                        this.props.balances.map((balance) => {
                                            const coin = balance.coin;
                                            return (
                                                <option value={coin} key={`autoex-${coin}`}> {this.props.getName(coin)} </option>
                                            );
                                        })
                                    }
                                </select>


                                <h4> Automatic Payout Threshold </h4>
                                <select
                                    onChange={(e) => {
                                        const option = e.target.value;
                                        this.setState(() => ({
                                            payout: option
                                        }));
                                        if(option == "custom"){
                                            this.props.setCustomPayOut(true);
                                            localStorage.setItem("custom", true);
                                        } else {
                                            this.props.setCustomPayOut(false);
                                            localStorage.setItem("custom", false);
                                        }
                                    }}
                                    defaultValue={this.state.payout}
                                >
                                    <option value="autopay" key={"autopay-auto"}> 
                                        Auto (Min payout)
                                    </option>
                                    <option value="custom" key={"autopay-custom"}>
                                        Custom
                                    </option>
                                </select>
                                {
                                    this.state.payout == "custom" &&
                                    <input 
                                        type="number"
                                        className="custom-payout-input"
                                        value={this.props.minPayout ? this.removeLeadingZero(this.props.minPayout) : 0}
                                        onChange={this.handleCustomInput}
                                    />
                                }
                            </div>
                        }
                    

                    <div className="sidebar-item sidebar-donations" >
                        <h3> Donations </h3>
                        <div>
                            <a onClick={() => {this.setState((prevState) => ({showDonation: prevState.showDonation == 'btc' ? '' : 'btc'}))}} >
                                {this.state.showDonation == 'btc' ? <b>BTC</b> : "BTC"} 
                            </a>
                        </div>
                        <div>
                            <a onClick={() => {this.setState((prevState) => ({showDonation: prevState.showDonation == 'eth' ? '' : 'eth'}))}} >
                                {this.state.showDonation == 'eth' ? <b>ETH</b> : "ETH"} 
                            </a>
                        </div>
                        <div>
                            <a onClick={() => {this.setState((prevState) => ({showDonation: prevState.showDonation == 'ltc' ? '' : 'ltc'}))}} >
                                {this.state.showDonation == 'ltc' ? <b>LTC</b> : "LTC"} 
                            </a>
                        </div>
                        </div>
                    { this.getDonation(this.state.showDonation) }

                    <div className="sidebar-item" >
                        <h3> Feedback </h3>
                        <a onClick={() => {this.setState((prevState) => ({showMore: !prevState.showMore}))}} >
                            {this.state.showMore ? "Hide" : "Show"}
                        </a>
                        </div>
                        {
                            this.state.showMore && 
                            <div className="sidebar-details" >
                                <p> This project is open source. I'd love to hear your feedback. Report any issues or feature requests on my 
                                    <a href="https://github.com/solexstudios/mphwatch/issues" target="_blank"> Github</a>.
                                    Alternatively send me a pm on <a href="https://www.reddit.com/message/compose/?to=Sxalpha" target="_blank"> Reddit</a>.
                                </p>
                            </div>
                        }
                </div>
            </div>
        );
    }
}

export default Sidebar;