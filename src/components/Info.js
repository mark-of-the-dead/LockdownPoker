import React from 'react';

class Info extends React.Component {
  
  getChipClass = (amt) => {
    let potClass;
    if(amt < 1){

    }else if(amt < 100){
      potClass = 'pot-xs'
    }else if(amt < 500){
      potClass = 'pot-s'
    }else if(amt < 2000){
      potClass = 'pot-m'
    }else{
      potClass = 'pot-l'
    }
    potClass += ' pot'
    return potClass;
  }

  render(){

    const pots = this.props.pots || {};


    return (
      <div className="game-info">
        {/* <ul>
          <li>Current Bet: {this.props.round.currentBet}</li>
          <li>Buy-In - {this.props.startchips}</li>
        </ul> */}
        {/* <p>Pots:</p> */}
        <ul className="potlist">
          {Object.keys(pots).map(key => <li key={key} className={this.getChipClass(pots[key])}>&pound;{pots[key]}</li>)}
        </ul>
      </div>
    )
  }
}

export default Info;
