import React from 'react';
import Info from './Info';

class Card extends React.Component{
    
    renderInfo( desc ){
        return (
            <Info info={this.props.info} description={desc} />
        );
    };
}

export default Card;