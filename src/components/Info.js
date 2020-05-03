import React from 'react';

class Info extends React.Component {
  render(){

    return (
      <React.Fragment>
      <p>Game Info</p>
      <ul>
        <li>Current Bet: {this.props.round.currentBet}</li>
        <li>Buy-In - {this.props.startchips}</li>
      </ul>
      <p>Pots:</p>
      <ul className="potlist">
        {Object.keys(this.props.pots).map(key => <li key={key}>&pound;{this.props.pots[key]}</li>)}
      </ul>
      </React.Fragment>
    )
  }
}

export default Info;
