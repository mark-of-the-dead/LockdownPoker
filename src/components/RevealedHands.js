import React from 'react';
import RevealedHand from './RevealedHand';

// import Player from './PlayerHand';


class RevealedHands extends React.Component {
  render(){
    return (
      <div className="reveal-list">
        <ul>
          {Object.keys(this.props.hands).map(key => <RevealedHand key={key} details={this.props.hands[key]} />)}
        </ul>
      </div>
    )
  }
}

export default RevealedHands;
