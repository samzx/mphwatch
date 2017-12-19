import React from 'react';
import ReactDOM from 'react-dom';

import 'normalize.css/normalize.css';
import './styles/styles.scss';

import {Doughnut, Line, HorizontalBar, Bar, Pie} from 'react-chartjs-2';
import { fail } from 'assert';

class App extends React.Component{
    state = {
        apiKey: '0bfbef832c137478240043c7d430815a940e19ddb481928cf51b811fc02297cd',
        balances: [],
        prices: [],
    }

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
        zencash: 'tan',
        zcash: 'orange'
    }

    fetchPrices = (coin) => {
        const url = `https://api.coinmarketcap.com/v1/ticker/${coin}`;
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        fetch(proxyurl + url, {
            method: "GET",
        })
        .then((resp) => {
            return resp.json();
        })
        .then((data) => {
            // console.log(data);
            this.setState((prevState) => ({
                prices: [
                    ...prevState.prices,
                    {
                        id: data[0].id,
                        name: data[0].name,
                        price_usd: data[0].price_usd,
                        price_btc: data[0].price_btc
                    }
                ]
            }));
            
        })
    }

    fetchData = (coin, method) => {
        const url = `https://${coin}miningpoolhub.com/index.php?page=api&action=${method}&api_key=${this.state.apiKey}`;
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        fetch(proxyurl + url, {
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

            // Get usd prices for each balance
            for( let i = 0; i < balances.length; i++){
                this.fetchPrices(balances[i].coin);
            }
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

    sumTotal = () => {
        let sum = 0;
        this.pair().forEach((entry) => {
            sum += entry.price * entry.total;
        })
        return sum;
    }

    generateDoughnutData = () => {
        const pairs = this.pair();
        let data = { 
            datasets: [
                { 
                    data: pairs.map((pair) => (pair.price * pair.total / this.sumTotal() * 100).toFixed(2) ),
                    backgroundColor: pairs.map((pair) => this.getColor(pair.coin))
                }],
            labels: pairs.map((pair) => this.getName(pair.coin))
        };
        return data;
    }

    generateBarData = () => {
        const pairs = this.pair();
        // console.log(pairs);
        let data = {
            datasets:[
                {
                    // Confirmed
                    label: 'Confirmed',
                    data: pairs.map((pair) => (pair.confirmed * pair.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })) ,
                    backgroundColor: pairs.map((pair) => 'green')
                },
                {
                    // On exchange
                    label: 'On exchange',
                    data: pairs.map((pair) => (pair.ae_unconfirmed * pair.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })),
                    backgroundColor: pairs.map((pair) => 'orange')
                },
                {
                    // Unconfirmed
                    label: 'Unconfirmed',
                    data: pairs.map((pair) => (pair.unconfirmed * pair.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })),
                    backgroundColor: pairs.map((pair) => 'crimson')
                },
            ],
            labels: pairs.map((pair) => pair.coin)
        }
        return data;
    }

    componentDidMount(){
        this.fetchData('', 'getuserallbalances', this.state.apiKey);
    }

    render(){
        return (
            <div style={{textAlign: 'center', margin: '5rem auto' }}>
                <h1> Mining Pool Hub Stats </h1>
                <p style={{overflowWrap: 'break-word'}}>{this.state.apiKey}</p>
                <div>
                    {
                        this.pair()
                        .map(({coin, confirmed, unconfirmed, ae_unconfirmed, total, price}, index) => {
                            return (
                                <div key={`balance-${index}`}>
                                    {this.getName(coin)}: ${(total * price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                            );
                        })
                    }
                    {
                        <h2>
                            Total: ${this.sumTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

                        </h2>
                    }
                </div>
                {
                    <div style={{}}>
                        <div className="charts" >
                            <Doughnut
                                width={640}
                                height={480}
                                data={this.generateDoughnutData()}
                                options = {{
                                    responsive: false
                                }}
                            />
                        </div>
                        <div className="charts" >
                            <Bar
                                data={this.generateBarData()}
                                width={640}
                                height={480}
                                options = {{
                                    responsive: false,
                                    scales: {
                                        xAxes: [{
                                            stacked: true,
                                            ticks: {
                                                beginAtZero: true
                                            }
                                        }],
                                        yAxes: [{
                                            stacked: true,
                                            ticks: {
                                                beginAtZero: true
                                            }
                                        }]
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

ReactDOM.render(<App />, document.getElementById("app"));
