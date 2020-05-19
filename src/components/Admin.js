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

class Admin extends React.Component {
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

    socket.emit('new admin');

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

  // getNextPlayer = (currentPlayer) => {
  //   const {players, round} = this.state;
  //   const keys = Object.keys(players), i = keys.indexOf(currentPlayer) || 0;
  //   console.log(keys, i);
  //   // Object.keys(players).map(key => {
  //   //   if(players)
  //   // })
  // }

  render(){
    return (
      <div className="react-poker">
        {/* <Players playerCount={Object.keys(this.state.players).length} players={this.state.players} />
        <Info gamename="Table 1" startchips={this.state.game.startchips} blinds={this.state.game.smallblind} round={this.state.round} players={this.state.players} pots={this.state.round.pots}/>
        <Table cards={this.state.community} /> */}

<hr/>

        <AddPlayerForm addPlayer={this.addPlayer} />
        <div className="hand-controls">
          <button onClick={this.loadSample}>Load Sample</button>
          <button onClick={this.resetSeatedPlayers}>reset Players</button>
          <button onClick={this.dealHold}>Deal new hand</button>
          <button onClick={this.dealFlop}>Deal flop</button>
          <button onClick={this.dealTurn}>Deal turn</button>
          <button onClick={this.dealRiver}>Deal river</button>
        </div>
        <BlindManager players={this.state.players} assignDealer={this.assignDealer} blinds={this.state.game.smallblind} betChips={this.betChips} />
        <MoneyManager players={this.state.players} pots={this.state.round.pots} splitPot={this.splitPot} />


<hr/>
        {/*
        {Object.keys(this.state.hands).map(key => <HoldCards key={key} playerId={key}  cards={this.state.hands[key]} />)}
        */}



      </div>
    )
  }
}



export default Admin;
