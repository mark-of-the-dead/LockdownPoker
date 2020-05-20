import React from 'react';
import Player from './Player';


class Players extends React.Component {
  render(){
    return (
      <div className="player-list">
        {/* <p>Players ({this.props.playerCount})</p> */}
        <ul>
          {Object.keys(this.props.players).map(key => <Player key={key} details={this.props.players[key]} />)}
        </ul>
      </div>
    )
  }
}

export default Players;
