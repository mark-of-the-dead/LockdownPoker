import React from 'react';


class Player extends React.Component {
  render(){
    const {avatar, cash, currentBet, folded, name} = this.props.details;
    let bet;
    let classAdditons = "";
    if(currentBet && !folded){
      bet = " (+" + currentBet + ")";
    }
    if(folded){
      classAdditons = " folded";
    }

    return (
      <li className={`player-box${classAdditons}`}>
        <img width="25" src={`/images/avatars/${avatar}.jpg`} />{name} <span>&pound;{cash}</span> <span>{bet}</span>
      </li>
    )
  }
}

export default Player;
