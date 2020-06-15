import React from 'react';
import { Doughnut, Line, HorizontalBar, Bar, Pie } from 'react-chartjs-2';
import { setTimeout } from 'timers';
import Sidebar from './Sidebar';
import Header from './Header';
import Progress from './Progress';
import HoldingsChart from './HoldingsChart';
import Balance from './Balance';
import Distribution from './Distribution';
import PayoutEstimate from './PayoutEstimate';
import Workers from './Workers';
import Earnings from './Earnings';
import { push as Menu } from 'react-burger-menu';

import { demo_balances, demo_prices, demo_workers, demo_amount24hr, demo_mining } from  '../../demo-fixtures';

export default class Dashboard extends React.Component{
    
    defaultState = {
        apiKey: '',
        balances: [],
        prices: [],
        mining: {},
        workers: [],
        remaining: 0,
        amount24hr: [],
        conversion: localStorage.getItem("conversion") ? localStorage.getItem("conversion") :  "usd",
        error: '',
        proxyurl: 'https://api-relay-mphwatch.herokuapp.com/', //'cors-anywhere.samxie.net/',
        info: false,
        minPayout: localStorage.getItem("payout") ? localStorage.getItem("payout") : 0,
        customPayout: localStorage.getItem("custom") ? JSON.parse(localStorage.getItem("custom")) :  false,
        ae_currency: localStorage.getItem("ae_currency") ? localStorage.getItem("ae_currency") :"auto",
        chartShouldRedraw: false,
        conversions: {
            btc: {
                rate: 0,
                pre: "",
                post: "BTC",
                decimals: 6
            },
            eth: {
                rate: 0,
                pre: "",
                post: "ETH",
                decimals: 5
            },
            usd: {
                rate: 1,
                pre: "$",
                post: "USD",
                decimals: 2
            },
            eur: {
                rate: 1.24,
                pre: "€",
                post: "EUR",
                decimals: 2
            },
            gbp: {
                rate: 1.41,
                pre: "£",
                post: "GBP",
                decimals: 2
            },
            aud: {
                rate: 0.8,
                pre: "$",
                post: "AUD",
                decimals: 2
            },
        }
    }

    backgroundColor = {
        confirmed: '#7093CC',
        exchange: '#D9E7FF',
        unconfirmed: '#aaa',

        bitcoin: '#FFE0B2',
        litecoin: '#F5F5F5',
        monero: '#FFCCBC',
        ethereum: '#CFD8DC',
        dash: '#BBDEFB',
        vertcoin: '#C8E6C9',
        'bitcoin-gold': '#FFECB3',
        monacoin: '#FFF9C4',
        feathercoin: '#FAFAFA',
        siacoin: '#B9F6CA',
        zencash: '#FFD180',
        zcash: '#FFE57F',
        zclassic: '#EEEEEE'
    }

    minPayout = {
        bitcoin: 0.001,
        litecoin: 0.002,
        ethereum: 0.01,
        monero: 0.05,
        dash: 0.01,
        zencash: 0.001,
        zcash: 0.001,
        siacoin: 0.01,
        'bitcoin-gold': 0.001,
        vertcoin: 0.1,
        monacoin: 0.1,
        feathercoin: 0.1,
        zclassic: 0.001,
    }

    tempPrices = [];
    tempWorkers = [];
    temp24hr = [];

    state = this.defaultState;

    handleInfoToggle = () => {
        this.setState((prevState) => ({info: !prevState.info}))
    }

    fetch24hr = (coin) => {
        const url = `${coin}.miningpoolhub.com/index.php?page=api&action=getdashboarddata&api_key=${this.state.apiKey}`;
        const promise = fetch(this.state.proxyurl + url, {
            method: "GET",
        })
        .then((resp) => {
            return resp.json();
        })
        .then((data) => {
            this.temp24hr.push({coin, amount: data.getdashboarddata.data.recent_credits_24hours.amount});
        })
        return { promise }
    }

    fetchHash = (coin) => {
        const url = `${coin}.miningpoolhub.com/index.php?page=api&action=getuserworkers&api_key=${this.state.apiKey}`;
        const promise = fetch(this.state.proxyurl + url, {
            method: "GET",
        })
        .then((resp) => {
            return resp.json();
        })
        .then((data) => {
            const poolWorkers = data.getuserworkers.data;
            let activeWorkers = [];
            for(let i=0; i<poolWorkers.length;i++){
                if(poolWorkers[i].hashrate > 0){
                    activeWorkers.push(poolWorkers[i]);
                }
            }
            activeWorkers.map((worker) => this.tempWorkers.push({
                ...worker,
                coin
            }));
        })
        return { promise }
    }

    fetchMining = () => {
        const url = 'whattomine.com/coins.json';
        fetch(this.state.proxyurl + url, {
            method: "GET",
        })
        .then((resp) => {
            return resp.json();
        })
        .then((data) => {
          if (!window.location.href.match(/.*\/demo$/)) {
            this.setState(() => ({
              mining: data.coins
            }))
          }
        })
    }

    fetchPrices = () => {
        const url = `api.coinmarketcap.com/v1/ticker/?limit=0`;
        const promise = 
        fetch(this.state.proxyurl + url, {
            method: "GET",
        })
        .then((resp) => {
            if(!resp.ok) return [];
            return resp.json();
        })
        .then((data) => {
            try {                
                this.tempPrices = data.slice();
            } catch (e) {
                console.error(`Could not fetch coin price data.`);
            }
        })
        return { promise };
    }

    fetchConversions = () => {
        const url = `api.fixer.io/latest?base=USD`;

        // Fiat conversoins
        fetch(this.state.proxyurl + url, {
            method: "GET",
        })
        .then((resp) => {
            return resp.json();
        })
        .then((data) => {
            Object.keys(this.state.conversions).map((supportedCurrency) => {
                Object.keys(data.rates).map((fetchedCurrency) => {
                    if(fetchedCurrency.toLocaleLowerCase() == supportedCurrency.toLocaleLowerCase()){
                        this.setState((prevState) => ({ 
                            conversions: {
                                ...prevState.conversions,
                                [supportedCurrency]: {
                                    ...prevState.conversions[supportedCurrency],
                                    rate: 1 / data.rates[fetchedCurrency]
                                },
                            },
                        }))
                    }
                })
            });

            // Crypto conversions
            this.setState((prevState) => ({
                conversions: {
                    ...prevState.conversions,
                    btc: {
                        ...prevState.conversions.btc,
                        rate: this.state.prices.filter((item) => {
                            return item.id == "bitcoin";
                        })[0].price_usd,
                    },
                    eth: {
                        ...prevState.conversions.eth,
                        rate: this.state.prices.filter((item) => {
                            return item.id == "ethereum";
                        })[0].price_usd,
                    }
                }
            }))
        })
    }

    fetchData = () => {
        if (window.location.href.match(/.*\/demo$/)) {
          this.setState(({
            balances: demo_balances,
            prices: demo_prices,
            amount24hr: demo_amount24hr,
            workers: demo_workers,
            mining: demo_mining.coins,
          }))
          return;
        }
        const url = `miningpoolhub.com/index.php?page=api&action=getuserallbalances&api_key=${this.state.apiKey}`;
        fetch(this.state.proxyurl + url, {
            method: "GET",
        })
        .then((resp) => {
            return resp.json();
        })
        .then((data) => {
            const balances = data.getuserallbalances.data;
            this.setState(() => ({
                balances
            }))

            
            Promise.all([this.fetchPrices().promise])
            .then(() => {
                this.setState((prevState) => ({
                    prices: this.tempPrices,
                }))
                this.fetchConversions();
                this.tempPrices = [];
                // console.log("Fetching prices attempt complete.")
            })

            Promise.all(balances.map((balance) => this.fetch24hr(balance.coin).promise))
            .then(() => {
                this.setState(() => ({amount24hr: this.temp24hr}));
                console.log("amount24hr", this.temp24hr)
                this.temp24hr = [];
            })

            Promise.all(balances.map((balance) => this.fetchHash(balance.coin).promise))
            .then(() => {
                this.setState(() => ({workers: this.tempWorkers}));
                console.log("workders", this.tempWorkers)
                this.tempWorkers = [];           
            })

        }).catch((e) => {
            console.error('Failed to fetch balance. API likely incorrect.');
            this.props.history.push('/');
        })
    }

    setMinPayOut = (minPayout) => {
        this.setState(() => ({
            minPayout
        }));
    }

    setCustomPayOut = (customPayout) => {
        this.setState(() => ({
            customPayout
        }))
    }

    getPrice = (coin) => {
        const items = this.state.prices.filter((price) => {
            return price.id == coin;
        });
        if( items.length == 1){
            return parseFloat(items[0].price_usd) * this.getConversionRate();
        } else {
            return 0;
        }
    }

    getName = (coin) => {
        const items = this.state.prices.filter((price) => {
            return price.id == coin;
        });
        if( items.length == 1){
            return items[0].name;
        } else {
            return "Unknown";
        }
    }
    
    getColor = (id) => {
        const color = this.backgroundColor[id];
        if(color){
            return color;
        } else {
            const newColor = "#"+((1<<24)*Math.random()|0).toString(16);
            this.backgroundColor = {
                ...this.backgroundColor,
                [id] : newColor
            }
            return newColor;
        }
    }

    setAeCurrency = (ae_currency) => {
        this.setState(() => ({ae_currency}));
    }

    getPrimaryCoin = () => {

        const pairs = this.pair();
        if(this.state.ae_currency != "auto"){    
            
            let aePair = undefined;
            pairs.forEach((pair) => {
                if(this.state.ae_currency == pair.coin){
                    aePair = pair;
                }
            })
            if(aePair != undefined){
                return aePair;
            }
        }

        let max = 0;
        let maxPair = undefined;
        pairs.filter((pair) => {
            let value = pair.total * pair.price
            if(value > max){
                max = value;
                maxPair = pair;
            }
        })
        return maxPair;
    }

    get24hr = (coin) => {
        if(this.state.amount24hr.length > 0){
            const coinObj = this.state.amount24hr.filter((obj) => {
                return obj.coin == coin;
            })[0];
            try{
                return coinObj.amount;
            } catch (e) {
                return undefined;
            }
        }
    }

    getMinPayout = () => {
        const maxPair = this.getPrimaryCoin();
        if(maxPair){
            let target = 0;
            if(this.state.customPayout){
                target =  this.state.minPayout * maxPair.price;
            } else {
                try {
                    target = this.minPayout[maxPair.coin] * maxPair.price;
                } catch (e) {
                    return 0;
                }
            }
            return target;
        }
    }

    getRemaining = () => {
        const remaining = this.getMinPayout() - this.sumTotal('total');
        return remaining < 0 ? 0 : remaining;
    }

    getUnit(number){
        let unit = '';
        let value = 0;
        if(number < 1){
            unit = 'H/s';
            value = number * 1000;
        } else if (number > 1000){
            value = number / 1000;
            unit = 'MH/s';
        } else {
            unit = 'KH/s';
            value = number;
        }
        return {unit, value};
    }

    getProfit = (coin, hashrate) => {
        try {
            let Key;
            Object.keys(this.state.mining).filter((key) => {
                if(key.toLowerCase() == coin.replace('-', '')){
                    Key = key;
                } else if (key.toLowerCase()+'coin' == coin.replace('-', '')){
                    Key = key;
                }
            })
    
            const {algorithm, block_time, block_reward, nethash} = this.state.mining[Key];
            const coinPerSecond = block_reward / block_time;
            const secondsPerDay = 86400;
            const coinsPerDay = coinPerSecond * secondsPerDay;
            const miningShare = hashrate * 1000 / nethash;
            const poolFee = 0.005;
            const dailyProfit = coinsPerDay * this.getPrice(coin) * miningShare * (1 - poolFee);
            return { dailyProfit, algorithm };
        } catch (e) {
            console.error(`Unable to get profitability of ${coin}.`);
            return { dailyProfit: 0 , algorithm: "Unknown"};
        }
    }

    getTotalProfit = () => {
        let profit = 0;
        this.state.workers.map(({hashrate, coin}) => {
            profit += this.getProfit(coin, hashrate).dailyProfit;
        })
        return profit;
    }

    getRemainingTime = (daysRemaining) => {
        let delta = daysRemaining * 86400;
        const days = Math.floor(delta / 86400);
        delta -= days * 86400;
        
        var hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;
        return {days, hours, delta};
    }

    getConversionRate = () => {
        const conversion = this.state.conversions[this.state.conversion];
        const rate = conversion.rate;
        return 1 / rate;
    }

    setConversion = (conversion) => {
        this.setState(() => ({
            conversion
        }));
    }

    pair = () => {
        const pairs = this.state.balances.map(({coin, confirmed, ae_unconfirmed, unconfirmed}, index) => {
            return {
                coin,
                confirmed,
                ae_unconfirmed,
                unconfirmed,
                total: confirmed + ae_unconfirmed + unconfirmed,
                price: this.getPrice(coin)
            }
        }).sort((a,b) => {
            return b.price * b.total - a.price * a.total;
        });
        return pairs;
    }

    sumTotal = (mode) => {
        let sum = 0;
        this.pair().forEach((entry) => {
            let part = 0;
            switch(mode){
                case 'total':
                    part = entry.total;
                    break;
                case 'confirmed':
                    part = entry.confirmed;
                    break;
                case 'exchange':
                    part = entry.ae_unconfirmed;
                    break;
                case 'unconfirmed':
                    part = entry.unconfirmed;
                    break;
            }
            if(entry.price) {
                sum += entry.price * part;
            }
        })
        return sum;
    }

    readifyInt(number, decimals = 2){
        if(number){
            return number.toFixed(decimals);
        }
    }

    readify(number, decimals = 2){
        if(number){
            return number.toLocaleString( undefined, { 
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            });
        }
    }

    setAPIKey = () => {
        let apiKey = this.props.match.params.id;
        apiKey = !!apiKey ? apiKey : '';
        this.setState(() => ({ apiKey }));
    }

    beginFetch = () => {
        this.fetchData();
        this.fetchMining();
    }

    componentWillMount(){
        this.setAPIKey();
    }

    componentDidMount(){
        this.beginFetch();
        setInterval(() => {
            this.beginFetch();
        } , 300000);
    }

    render(){
        return (
            <div className="dashboard" id="dashboard">
                <Menu pageWrapId={ "dashboard-main" } outerContainerId={ "dashboard" } >
                    <Sidebar
                        error={this.state.error}
                        id={this.props.match.params.id}
                        history={this.props.history}
                        setMinPayOut={this.setMinPayOut}
                        setCustomPayOut={this.setCustomPayOut}
                        minPayout={this.state.minPayout}
                        conversions={this.state.conversions}
                        conversion={this.state.conversion}
                        setConversion={this.setConversion}
                        balances={this.state.balances}
                        getName={this.getName}
                        setAeCurrency={this.setAeCurrency}
                        ae_currency={this.state.ae_currency}
                    />
                </Menu>
                <div className="dashboard-main" id="dashboard-main">
                    <Header
                        pair={this.pair}
                        readify={this.readify}
                        getName={this.getName}
                        sumTotal={this.sumTotal}
                        info={this.state.info}
                        handleInfoToggle={this.handleInfoToggle}
                        conversion={this.state.conversions[this.state.conversion]}
                    />
                    <div className="container dashboard-container">
                        {
                            this.state.workers.length > 0 &&
                            <div className="row row--stats" >                        
                                <Workers
                                    workers={this.state.workers}
                                    getProfit={this.getProfit}
                                    getName={this.getName}
                                    readify={this.readify}
                                    getUnit={this.getUnit}
                                    info={this.state.info}
                                />
                                <Earnings
                                    display={this.state.workers.length > 0}
                                    readify={this.readify}
                                    getTotalProfit={this.getTotalProfit}
                                    info={this.state.info}
                                    conversion={this.state.conversions[this.state.conversion]}
                                />
                                <PayoutEstimate
                                    display={this.state.workers.length > 0}
                                    getRemainingTime={this.getRemainingTime}
                                    getRemaining={this.getRemaining}
                                    getTotalProfit={this.getTotalProfit}
                                    getName={this.getName}
                                    readify={this.readify}
                                    getPrimaryCoin={this.getPrimaryCoin}
                                    getMinPayout={this.getMinPayout}
                                    info={this.state.info}
                                    conversion={this.state.conversions[this.state.conversion]}
                                />
        
                            </div>
                        }

                        <div className="row row--progress" >                                            
                            <Progress 
                                readify={this.readifyInt}
                                sumTotal={this.sumTotal}
                                getMinPayout={this.getMinPayout}
                                getRemaining={this.getRemaining}
                                backgroundColor={this.backgroundColor}
                                info={this.state.info}
                            />
                        </div>

                        <div className="row row--graph" >                        
                            <HoldingsChart 
                                pair={this.pair}
                                readify={this.readifyInt}
                                getName={this.getName}
                                backgroundColor={this.backgroundColor}
                                info={this.state.info}
                                conversion={this.state.conversions[this.state.conversion]}
                            />

                            <Distribution
                                pair={this.pair}
                                get24hr={this.get24hr}
                                getColor={this.getColor}
                                getName={this.getName}
                                info={this.state.info}
                                readify={this.readifyInt}
                                conversion={this.state.conversions[this.state.conversion]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}