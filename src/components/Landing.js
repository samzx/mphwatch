import React from 'react';

export default class Landing extends React.Component{
    state = {
        APIKey: '',
        remember: true,
        error: '',
        help: false
    }

    verifyKey = (key) => {
        const url = `https://miningpoolhub.com/index.php?page=api&action=getuserallbalances&api_key=${key}`;
        const proxyurl = 'https://stark-headland-49184.herokuapp.com/';

        fetch(proxyurl + url, {
            method: "GET",
        })
        .then((resp) => {
            // console.log(resp);
            if(resp.ok){
                if(this.state.remember){
                    localStorage.setItem("apikey", this.state.APIKey);
                }
                this.props.history.push(`/${this.state.APIKey}`);
            } else {
                this.setState(() => ({error: 'Please enter a valid API Key'}));
            }
        })
        .then((data) => {

        }).catch((e) => {
            console.log(e);
        })
    }

    onSubmit = (e) => {
        e.preventDefault();
        console.log(this.state.APIKey);
        this.verifyKey(this.state.APIKey);
    }

    componentDidMount(){
        const APIKey = localStorage.apikey
        if(APIKey){
            this.setState(() => ({APIKey}));
        }
    }

    render(){
        return (
            <div className="landing" >
                <div className="input-container">
                    <h1 className="landing-title" >MPH Stats</h1>
                    <h4>Enter your API Key to get started</h4>
                    <form onSubmit={this.onSubmit} className="apiform" >
                        <input 
                            type="text"
                            className="input"
                            placeholder="API Key"
                            onFocus={(e) => e.target.placeholder = ""} 
                            onBlur={(e) => e.target.placeholder = "API Key"}
                            value={this.state.APIKey} 
                            onChange={(e) => {
                                const APIKey = e.target.value;
                                this.setState(() => ({APIKey}))
                            }} 
                        />
                        {
                            !!this.state.error && <p style={{color: "crimson", padding: "0"}}><b>{this.state.error}</b></p>
                        }
                        <div>
                            <input 
                                defaultChecked={this.state.remember}
                                type="checkbox" 
                                value={this.state.remember} 
                                id="remember"
                                onChange={ (e) => {
                                    this.setState((prevState) => ({remember: !prevState.remember}))
                                }}/>
                            <label htmlFor="remember">Remember Me</label>
                        </div>
                        <button className="landing-button" > Enter </button>
                        <div style={{marginBottom: 0}}>
                            <a className="landing-help" onClick={(prevState) => this.setState({help: !this.state.help})} >Help</a>
                            {
                                this.state.help && 
                                <p>Visit <a href="https://miningpoolhub.com/?page=account&action=edit" target="_blank"> Mining pool hub</a> and paste the API key above</p>
                            }
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}