import React from 'react';
// import Player from './PlayerHand';


class RevealedHand extends React.Component {
  render(){
    const revealed = this.props.details;
    return (
      <li className="revealedhand">
            {revealed.name}
            <span className={`revealcard ${revealed.hand[0]}`}></span>
            <span className={`revealcard ${revealed.hand[1]}`}></span>
          </li>
    )
  }
}

export default RevealedHand;
