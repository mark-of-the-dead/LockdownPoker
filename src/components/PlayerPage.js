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
      game: data.game,
      hands: data.hands,
      community: data.community,
      round: data.round,
      connections: data.connections
    });
  }

  componentDidMount(){
    socket.on('state', this.syncState);

    socket.emit('new connection');

  }

  // componentWillUnmount(){
  //   console.log('UNMOUNTING!');
  // }


  addPlayer = (player) => {
    console.log(player);
    socket.emit('add player', player );
  }

  loadSample = () => {
    socket.emit('load sample', samplePlayers );
  }

  // setGameConfig = () => {
  //   this.setState({
  //     game: { 'smallblind' : 25, 'startchips' : 5000},
  //     round: {pots: [0], currentBet: 0}
  //   })
  // }

  resetDeck = () => {
    const newdeck = JSON.parse(JSON.stringify(freshDeck));

    this.setState({
      deck: newdeck
    });

  }

  dealHold = () => {
    socket.emit('deal hold');
  }

  dealFlop = () => {
    socket.emit('deal flop');
  }

  dealTurn = () => {
    socket.emit('deal turn');
  }

  dealRiver = () => {
    socket.emit('deal river');
  }

  betChips = (player, amount) => {
    socket.emit('bet', player, amount);
  }


  rebuy = (player) => { //ADMIN
   socket.emit('rebuy', player);
  }

  assignDealer = (playerid) => {
    socket.emit('assign dealer', playerid);
  }


  callBet = (player) => {
    this.betChips(player, this.state.players[player].currentBet ? this.state.round.currentBet - this.state.players[player].currentBet : this.state.round.currentBet);
  }

  checkBet = (player) => {
    socket.emit('check bet', player);
  }

  lockBets = () => {
    socket.emit('lock bets');
  }

  resetSeatedPlayers = () => {
    socket.emit('reset players');
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

  startNewHand = () => {
    this.resetSeatedPlayers();
    this.dealHold();
  }


  sidePot = (amount) => {
    socket.emit('sidepot', amount);
  }

  splitPot = (playerIDs, potID) => {
    socket.emit('splitPot',  playerIDs, potID);
  }

  moveMoney = (fromPlayer, toPlayer, amount) => {
    socket.emit('move money', fromPlayer, toPlayer, amount)
  }

  movePotMoney = (fromPot, toPot, amount) => {
    socket.emit('move pmoney', fromPot, toPot, amount)
  }



  render(){
    const playerId = this.props.match.params.playerId;
    const playerTitle = this.state.players[playerId] ? this.state.players[playerId].name + "(#" + playerId + ")" : '';

    return (
      <div className="react-poker">
       <h1>{playerTitle}</h1>
       <PlayerUI id={playerId} player={this.state.players[playerId]}  cards={this.state.hands[playerId]}
          betChips={this.betChips}
          foldPlayer={this.foldPlayer}
          callBet={this.callBet}
          checkBet={this.checkBet}
          standPlayer={this.standPlayer}
          sitPlayer={this.sitPlayer} />

      </div>
    )
  }
}

export default App;
