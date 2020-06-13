import React from 'react';

class Info extends React.Component {
  render(){

    const pots = this.props.pots || {};

    return (
      <div className="game-info">
        <ul>
          <li>Current Bet: {this.props.round.currentBet}</li>
          {/* <li>Buy-In - {this.props.startchips}</li> */}
        </ul>
        {/* <p>Pots:</p> */}
        <ul className="potlist">
          {Object.keys(pots).map(key => <li key={key}>&pound;{pots[key]}</li>)}
        </ul>
      </div>
    )
  }
}

export default Info;
