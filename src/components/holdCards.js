import React from 'react';

class HoldCards extends React.Component {
  render(){

    const id = this.props.playerId;

    return (
      <div>
        <p>hold cards (player {id})</p>
        <p>{this.props.cards[0]},{this.props.cards[1]}</p>
      </div>
    )
  }
}

export default HoldCards;
