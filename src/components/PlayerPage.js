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

const server = window.location.protocol + '//' + window.location.hostname + ':5000'
let socket = io(server)

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
    console.log(data.game.gameID);
    this.setState({
      players: data.players,
      game: data.game,
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
        // if(data[3] != this.state.game.gameId){
        //   //ignore previous save
        // }else{
        //   //reconnect automatically
        // }
        socket.emit('claim player', data[0], data[1], socket.id, true);
      }, 1000)
    }
  }

  removeSave = () => {
    window.localStorage.removeItem('savedplayer');
    window.location.reload();
  }

  betChips = (player, amount) => {
    socket.emit('bet', player, amount, socket.id);
  }

  callBet = (player) => {
    socket.emit('call bet', player, socket.id);
  }

  checkBet = (player) => {
    socket.emit('check bet', player, socket.id);
  }

  standPlayer = (playerid) => {
    socket.emit('stand player', playerid, socket.id );
  }

  sitPlayer = (playerid) => {
    socket.emit('sit player', playerid, socket.id );
  }

  foldPlayer = (playerid) => {
    socket.emit('fold player', playerid, socket.id );
  }

  revealHand = (playerid) => {
    socket.emit('reveal', playerid, socket.id );
  }

  claimPlayer = (e) => {
    e.preventDefault();
    socket.emit('claim player', this.props.match.params.playerId, this.pinRef.current.value, socket.id, false);
    window.localStorage.setItem('savedplayer', JSON.stringify([this.props.match.params.playerId, this.pinRef.current.value, Date.now(), this.state.game.gameID]));
  }
  

  render(){
    let playerId = this.props.match.params.playerId;
    // const playerTitle = this.state.players[playerId] ? this.state.players[playerId].name + "(#" + playerId + ")" : '';
    const playerTitle = this.state.players[playerId] ? this.state.players[playerId].name : '';

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
