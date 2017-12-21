import React from 'react';
import {Doughnut, Line, HorizontalBar, Bar, Pie} from 'react-chartjs-2';
import { setTimeout } from 'timers';

export default class Dashboard extends React.Component{
    
    defaultState = {
        apiKey: '', //'0bfbef832c137478240043c7d430815a940e19ddb481928cf51b811fc02297cd',
        balances: [],
        prices: [],
        mining: {},
        workers: [],
        remaining: 0,
        amount24hr: [],
        error: '',
        proxyurl: 'https://stark-headland-49184.herokuapp.com/'
    }
    tempPrices = [];
    tempWorkers = [];
    temp24hr = [];
    backgroundColor = {
        bitcoin: 'orange',
        'bitcoin-gold': 'gold',
        monacoin: 'lightyellow',
        litecoin: 'silver',
        ethereum: 'black',
        vertcoin: 'green',
        dash: 'cornflowerblue',
        feathercoin: 'grey',
        siacoin: 'springgreen',
        zencash: 'orange',
        zcash: 'orange',
        zclassic: 'grey'
    }
    minPayout = {
        dash: 0.01
    }

    state = this.defaultState;

    fetch24hr = (coin) => {
        const url = `https://${coin}.miningpoolhub.com/index.php?page=api&action=getdashboarddata&api_key=${this.state.apiKey}`;
        const promise = fetch(this.state.proxyurl + url, {
            method: "GET",
        })
        .then((resp) => {
            return resp.json();
        })
        .then((data) => {
            // console.log(coin, data.getdashboarddata.data.recent_credits_24hours.amount);
            this.temp24hr.push({coin, amount: data.getdashboarddata.data.recent_credits_24hours.amount});
        })
        return { promise }
    }

    fetchHash = (coin) => {
        const url = `https://${coin}.miningpoolhub.com/index.php?page=api&action=getuserworkers&api_key=${this.state.apiKey}`;
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
            // console.log(coin, activeWorkers);
            activeWorkers.map((worker) => this.tempWorkers.push({
                ...worker,
                coin
            }));
        })
        return { promise }
    }

    fetchMining = () => {
        const url = 'http://whattomine.com/coins.json';
        fetch(this.state.proxyurl + url, {
            method: "GET",
        })
        .then((resp) => {
            return resp.json();
        })
        .then((data) => {
            // console.log(data);
            this.setState(() => ({
                mining: data.coins
            }));
        })
    }

    fetchPrices = (coin) => {
        const url = `https://api.coinmarketcap.com/v1/ticker/${coin}`;
        const promise = 
        fetch(this.state.proxyurl + url, {
            method: "GET",
        })
        .then((resp) => {
            return resp.json();
        })
        .then((data) => {
            this.tempPrices.push({
                id: data[0].id,
                name: data[0].name,
                price_usd: data[0].price_usd,
                price_btc: data[0].price_btc
            })
        })
        return { promise };
    }

    fetchData = () => {
        const url = `https://miningpoolhub.com/index.php?page=api&action=getuserallbalances&api_key=${this.state.apiKey}`;
        fetch(this.state.proxyurl + url, {
            method: "GET",
        })
        .then((resp) => {
            return resp.json();
        })
        .then((data) => {
            // console.log(data);
            const balances = data.getuserallbalances.data;
            this.setState(() => ({
                balances
            }))

            Promise.all(balances.map((balance) => this.fetchPrices(balance.coin).promise))
            .then(() => {
                this.setState(() => ({prices: this.tempPrices}));
                this.tempPrices = [];
            })

            Promise.all(balances.map((balance) => this.fetch24hr(balance.coin).promise))
            .then(() => {
                console.log("promise fulfilled");
                this.setState(() => ({amount24hr: this.temp24hr}));
                this.temp24hr = [];
            })

            Promise.all(balances.map((balance) => this.fetchHash(balance.coin).promise))
            .then(() => {
                this.setState(() => ({workers: this.tempWorkers}));
                this.tempWorkers = [];           
            })

        }).catch((e) => {
            console.log(e);
            this.setState(() => ({error: 'Please double check API Key'}));
        })
    }

    getPrice = (coin) => {
        const items = this.state.prices.filter((price) => {
            return price.id == coin;
        });
        if( items.length == 1){
            return parseFloat(items[0].price_usd);
        }
    }

    getName = (coin) => {
        const items = this.state.prices.filter((price) => {
            return price.id == coin;
        });
        if( items.length == 1){
            return items[0].name;
        }
    }
    
    getColor = (id) => {
        const color = this.backgroundColor[id];
        if(color){
            return color;
        } else {
            return "#"+((1<<24)*Math.random()|0).toString(16);
        }
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
            let part;
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
            sum += entry.price * part;
        })
        return sum;
    }

    getPrimaryCoin = () => {
        const pairs = this.pair();
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
            return coinObj.amount;
        }
    }

    getMinPayout = () => {
        const maxPair = this.getPrimaryCoin();
        if(maxPair){
            const target = this.minPayout[maxPair.coin] * maxPair.price
            return target;
        }
    }

    getRemaining = () => {
        return this.getMinPayout() - this.sumTotal('total');
    }

    generateDoughnutData = () => {
        const pairs = this.pair();
        let data = { 
            datasets: [
                { 
                    // data: pairs.map((pair) => (pair.price * pair.total / this.sumTotal('total') * 100).toFixed(2) ),
                    data: pairs.map((pair) => (pair.price * this.get24hr(pair.coin)).toFixed(2)), // (pair.price * this.get24hr(pair.coin) / this.sumTotal('total') * 100).toFixed(2) ),
                    backgroundColor: pairs.map((pair) => this.getColor(pair.coin))
                }],
            labels: pairs.map((pair) => this.getName(pair.coin))
        };
        return data;
    }

    getBarOptions = () => (
        {
            title: {
                display: true,
                text: 'Dollar Value (USD)',
                position: 'top'
            },
            responsive: true,
            scales: {
                xAxes: [{
                    scaleLabel: {
                        labelString: 'Dollar Value (USD)',
                        display: true
                    },
                    stacked: true,
                    ticks: {
                        beginAtZero: true
                    }
                }],
                yAxes: [{

                    stacked: true,
                    ticks: {
                        beginAtZero: true
                    },
                }]
            }
        }
    );

    generateBarData = () => {
        const pairs = this.pair();
        // console.log(pairs);
        let data = {
            datasets:[
                {
                    // Confirmed
                    label: 'Confirmed',
                    data: pairs.map((pair) => this.readify(pair.confirmed * pair.price)) ,
                    backgroundColor: pairs.map((pair) => 'green')
                },
                {
                    // On exchange
                    label: 'On exchange',
                    data: pairs.map((pair) => this.readify(pair.ae_unconfirmed * pair.price)),
                    backgroundColor: pairs.map((pair) => 'orange')
                },
                {
                    // Unconfirmed
                    label: 'Unconfirmed',
                    data: pairs.map((pair) => this.readify(pair.unconfirmed * pair.price)),
                    backgroundColor: pairs.map((pair) => 'crimson')
                },
            ],
            labels: pairs.map((pair) => this.getName(pair.coin))
        }
        return data;
    }

    getProgressBarData = () => (
        {
            datasets:[
                {
                    label: 'Confirmed',
                    data: [this.readify(this.sumTotal('confirmed')/this.getMinPayout()*100)],
                    backgroundColor: 'green'
                },
                {
                    label: 'On Exchange',
                    data: [this.readify(this.sumTotal('exchange')/this.getMinPayout()*100)],
                    backgroundColor: 'orange'
                },
                {
                    label: 'Unconfirmed',
                    data: [this.readify(this.sumTotal('unconfirmed')/this.getMinPayout()*100)],
                    backgroundColor: 'red'
                },
                {
                    label: 'Remaining',
                    data: [this.readify(this.getRemaining()/this.getMinPayout()*100)],
                }
            ],
            labels: []
        }
    );

    getProgressBarOptions = () => (
        {
            tooltips:{
                enabled: false
            },
            legend: {
                display: true,
            },
            scales: {
                xAxes: [{
                    stacked: true,
                    ticks: {
                        beginAtZero: true,
                        max: 100
                    },
                }],
                yAxes: [{
                    stacked: true,
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            events: [],
            hover: {
                
            }
        }
    );

    readify(number){
        if(number){
            return number.toLocaleString( undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
    }

    significate(number){
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
        // console.log(this.state.mining);
        let Key;
        Object.keys(this.state.mining).filter((key) => {
            if(key.toLowerCase().match(coin.replace('-', ''))){
                Key = key;
            }
        })

        const {algorithm, block_time, block_reward, nethash} = this.state.mining[Key];
        const coinPerSecond = block_reward / block_time;
        const secondsPerDay = 86400;
        const coinsPerDay = coinPerSecond * secondsPerDay;
        const miningShare = hashrate * 1000 / nethash;
        const dailyProfit = coinsPerDay * this.getPrice(coin) * miningShare;
        return { dailyProfit, algorithm };
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

    componentWillMount(){
        this.setState(() => ({ apiKey: this.props.match.params.id }));
    }

    componentDidMount(){
        this.fetchData();
        this.fetchMining();
        setInterval(() => {
            this.fetchData();
            this.fetchMining();
        } , 60000);

        setTimeout(() => {
            // this.setState(() => ({workers: [{username: 'samx', hashrate: 0.4, coin: 'bitcoin-gold'}]}))
        }, 3000);
    }

    render(){
        return (
            <div style={{textAlign: 'center', margin: '5rem auto', maxWidth: 720 }}>
                <h1> Mining Pool Hub Stats </h1>
                {
                    !this.state.error && <h3>Your API key is</h3>
                }
                <p style={{overflowWrap: 'break-word'}}>{ !this.state.error ? this.props.match.params.id : this.state.error}</p>
                <h3>Consider bookmarking me for future use 😇</h3>
                {
                    <div className="charts" >
                        <h1> Payout Progress {} </h1>

                        <HorizontalBar
                            height={80}
                            data={this.getProgressBarData()}
                            options={this.getProgressBarOptions()}
                        />

                    </div>
                }
                {
                    this.state.workers.map(({hashrate, username, coin}) => {
                        // console.log(this.state.workers);
                        const {dailyProfit, algorithm} = this.getProfit(coin, hashrate);
                        const daysRemaining = this.getRemaining() / dailyProfit;
                        

                        return (
                            <div key={`worker:${username}${coin}-div`}>
                                <p key={`worker:${username}${coin}-hash`} >{username} : {algorithm} : {this.getName(coin)} : {`${this.readify(this.significate(hashrate).value)} ${this.significate(hashrate).unit}`}</p>
                                <p key={`worker:${username}${coin}-profit`}> Daily: ${`${this.readify(dailyProfit)}`}</p>
                                <p key={`worker:${username}${coin}-wk`}> Weekly: ${`${this.readify(dailyProfit * 7)}`}</p>
                                <p key={`worker:${username}${coin}-mt`}> Monthly: ${`${this.readify(dailyProfit * 365 / 12)}`}</p>
                            </div>
                        );
                    })
                }
                {
                    this.state.workers.length > 1 && 
                    <h2 key={`totalProfit`}> Total Daily: ${`${this.readify(this.getTotalProfit())}`} </h2>
                }
                {
                    <div>
                        <p key={`totalTimeUntilPayout`}> Time until payout: {
                            this.getRemainingTime(this.getRemaining() / this.getTotalProfit()).days
                        } days, {
                            this.getRemainingTime(this.getRemaining() / this.getTotalProfit()).hours
                        }  hours </p>
                        <p> Payout Amount: ${this.readify(this.getMinPayout())}</p>
                    </div>

                }
                {
                    <div style={{}}>
                        <div className="charts" >
                            <h1>Holdings</h1>

                            <Bar
                                data={this.generateBarData()}
                                width={640}
                                height={480}
                                options = {this.getBarOptions()}
                            />

                        </div>
                        <div>
                            {
                                <h2>
                                    Total: ${this.readify(this.sumTotal('total'))}
                                </h2>
                            }
                            {
                                this.pair()
                                .map(({coin, confirmed, unconfirmed, ae_unconfirmed, total, price}, index) => {
                                    return (
                                        <div key={`balance-${index}`}>
                                            {this.getName(coin)}: ${this.readify(total * price)}
                                        </div>
                                    );
                                })
                            }
                        </div>
                        <div className="charts" >
                            <h1> 24 Hour Credit Distribution</h1>

                            <Pie
                                width={640}
                                height={480}
                                data={this.generateDoughnutData()}
                                options = {{
                                    responsive: true,
                                    tooltips: {
                                        callbacks: {
                                            title: (tooltipItem, chart) => {return 'Percentage'},
                                            afterLabel: (tooltipItem, chart) => {"yes"}
                                        },
                                    }
                                }}
                            />

                        </div>
                    </div>
                    }
            </div>
        );
    }
}