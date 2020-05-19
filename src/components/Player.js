import React from 'react';


class Player extends React.Component {
  render(){
    const {avatar, cash, checked, currentBet, dealer, folded, name, seated} = this.props.details;
    let bet;
    let classAdditons = "";
    if(checked){
      bet = " (checked)";
    }
    if(currentBet && !folded){
      bet = " (+" + currentBet + ")";
    }
    if(folded || !seated){
      classAdditons += " folded";
    }
    if(dealer){
      classAdditons += " dealer";
    }

    return (
      <li className={`player-box${classAdditons}`}>
        <img width="25" src={`/images/avatars/${avatar}.jpg`} />
        <span className="player-name">{name}</span>
        <span className="player-cash">&pound;{cash}</span>
        <span className="player-status">{bet}</span>
      </li>
    )
  }
}

export default Player;
