import React from 'react';

import Info from './Info';
import Players from './Players';
import Table from './Table';

import AddPlayerForm from './AddPlayerForm';
import samplePlayers from '../sample-players';
import freshDeck from '../fresh-deck';

import HoldCards from './holdCards';

import PlayerUI from './PlayerUI';

import BlindManager from './BlindManager';
import MoneyManager from './MoneyManager';

import io from 'socket.io-client'

let socket = io(`http://localhost:5000`)

class App extends React.Component {

  // idRef = React.createRef();
  pinRef = React.createRef();

  constructor(props){
    super(props)
    // this.resetDeck = this.resetDeck.bind(this);
    // this.dealHold = this.dealHold.bind(this);
  }

  state = {
    players: {},
    game: {},
    hands: {},
    community: {},
    round: {},
    deck: freshDeck
  };

  syncState = (data) => {
    this.setState({
      players: data.players,
      connections: data.connections
    });
  }

  syncHand = (data) => {
    this.setState({
      hands: data.hands
    });
  }

  hideLogin = () => {
    document.getElementById('playerPicker').classList.add('hidden');
  }
  
  componentDidMount(){
    socket.on('state', this.syncState);
    socket.on('hand', this.syncHand);
    socket.on('login success', this.hideLogin);

    socket.emit('new connection');

    if(window.localStorage.getItem('savedplayer') !== null){
      setTimeout(function(){
        const data = JSON.parse(window.localStorage.getItem('savedplayer'));
        socket.emit('claim player', data[0], data[1], socket.id, true);
      }, 1000)
    }
  }

  removeSave = () => {
    window.localStorage.removeItem('savedplayer');
    window.location.reload();
  }

  betChips = (player, amount) => {
    socket.emit('bet', player, amount);
  }

  callBet = (player) => {
    socket.emit('call bet', player);
  }

  checkBet = (player) => {
    socket.emit('check bet', player);
  }

  standPlayer = (playerid) => {
    socket.emit('stand player', playerid );
  }

  sitPlayer = (playerid) => {
    socket.emit('sit player', playerid );
  }

  foldPlayer = (playerid) => {
    socket.emit('fold player', playerid );
  }

  revealHand = (playerid) => {
    socket.emit('reveal', playerid, socket.id );
  }

  claimPlayer = (e) => {
    e.preventDefault();
    socket.emit('claim player', this.props.match.params.playerId, this.pinRef.current.value, socket.id, false);
    window.localStorage.setItem('savedplayer', JSON.stringify([this.props.match.params.playerId, this.pinRef.current.value, Date.now()]));
  }
  

  render(){
    let playerId = this.props.match.params.playerId;
    const playerTitle = this.state.players[playerId] ? this.state.players[playerId].name + "(#" + playerId + ")" : '';

    return (
      <div className="react-poker-player">
        <div className="player-picker" id="playerPicker">
          <form onSubmit={this.claimPlayer}>
            
            <label>Pin:</label><input type="text" name="playerpin" ref={this.pinRef}/>
            <button type="submit">Login</button>
          </form>
        </div>
        <h1>{playerTitle}</h1>
        <PlayerUI id={playerId} player={this.state.players[playerId]}  cards={this.state.hands[playerId]}
          betChips={this.betChips}
          foldPlayer={this.foldPlayer}
          revealHand={this.revealHand}
          callBet={this.callBet}
          checkBet={this.checkBet}
          standPlayer={this.standPlayer}
          sitPlayer={this.sitPlayer} />
          <button onClick={this.removeSave}>Log out</button>

      </div>
    )
  }
}

export default App;
