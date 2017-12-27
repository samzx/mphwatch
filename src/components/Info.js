import React from 'react';
import FA from 'react-fontawesome';

class Info extends React.Component{

    state={
        over: false
    }

    handleOver = () => {
        this.setState(() => ({over: true}));
    }

    handleLeave = () => {
        this.setState(() => ({over: false}));
    }

    render(){
        return(
            <div 
                onMouseEnter={this.handleOver}
                onMouseLeave={this.handleLeave}
                
                onTouchStart={this.handleOver}
                onTouchEnd={this.handleOver}
                className="info"
            >
                <FA name="info-circle" className={ this.state.over ? "info--on" : "info--off"} style={{opacity: this.props.info ? 1 : 0}}/>
                {
                    this.state.over &&
                    this.props.info && 
                        <div className="description-container">
                            <div className="description">
                                {
                                    this.props.description
                                }
                            </div>
                    </div>
                }
            </div>
        );
    }
}
 
export default Info;