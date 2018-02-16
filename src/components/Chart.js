import React from 'react';
import Card from './Card';

class Chart extends Card {
    state = {
        redraw: false
    }

    componentDidMount(){
        window.addEventListener('resize', () => {
            this.setState(() => ({ redraw: true}));
            for(var i=0; i<10;i++){
                setTimeout(() => {
                    this.setState(() => ({ redraw: true }));
                }, 100*i);
            }
        });
    }
    
    render(){}
}

export default Chart;