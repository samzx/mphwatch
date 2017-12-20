import React from 'react';

export default class Landing extends React.Component{
    state = {
        APIKey: undefined
    }

    onSubmit = (e) => {
        e.preventDefault();
        console.log(this.state.APIKey);
        localStorage.setItem("apikey", this.state.APIKey);
        this.props.history.push(`/${this.state.APIKey}`);
    }

    componentDidMount(){
        const APIKey = localStorage.apikey
        if(APIKey){
            this.setState(() => ({APIKey}));
        }
    }

    render(){
        return (
            <div>
                <div className="input-container">
                <h1>Enter your API Key to get started</h1>
                    <form onSubmit={this.onSubmit}>
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
                    </form>
                </div>
            </div>
        );
    }
}