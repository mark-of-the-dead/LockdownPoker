import React from 'react';


class Player extends React.Component {
  render(){
    const {avatar, cash, checked, currentBet, dealer, folded, name} = this.props.details;
    let bet;
    let classAdditons = "";
    if(checked){
      bet = " (checked)";
    }
    if(currentBet && !folded){
      bet = " (+" + currentBet + ")";
    }
    if(folded){
      classAdditons += " folded";
    }
    if(dealer){
      classAdditons += " dealer";
    }

    return (
      <li className={`player-box${classAdditons}`}>
        <img width="25" src={`/images/avatars/${avatar}.jpg`} />{name} <span>&pound;{cash}</span> <span>{bet}</span>
      </li>
    )
  }
}

export default Player;
