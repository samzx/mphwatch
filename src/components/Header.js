import React from 'react';
import Balance from './Balance';
import FA from 'react-fontawesome';

class Header extends React.Component{

    render(){
        return (
            <div className="header">
                <div className="container header-container">
                    <FA name="info-circle" className={this.props.info ? "info-toggle info-toggle--on" : "info-toggle info-toggle--off"} onClick={this.props.handleInfoToggle} />
                    <Balance
                        pair={this.props.pair}
                        readify={this.props.readify}
                        getName={this.props.getName}
                        sumTotal={this.props.sumTotal}
                    />
                </div>
            </div>
        );
    }
}

export default Header;