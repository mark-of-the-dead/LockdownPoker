import React from 'react';

import Info from './Info';
import Players from './Players';
import Table from './Table';

import samplePlayers from '../sample-players';
import freshDeck from '../fresh-deck';

import RevealedHands from './RevealedHands';

import io from 'socket.io-client'

// let socket = io(`http://localhost:5000`)
const server = window.location.protocol + '//' + window.location.hostname + ':5000';
let socket = io(server);

class App extends React.Component {
  constructor(props){
    super(props)
    // this.resetDeck = this.resetDeck.bind(this);
    // this.dealHold = this.dealHold.bind(this);
  }

  state = {
    players: {},
    game: {},
    // hands: {},
    community: {},
    round: {},
    revealed: {},
    deck: freshDeck
  };

  syncState = (data) => {
    this.setState({
      players: data.players,
      game: data.game,
      // hands: data.hands,
      community: data.community,
      round: data.round,
      revealed: data.revealed,
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
      <div className="react-poker tableview">
        <Players playerCount={Object.keys(this.state.players).length} players={this.state.players} />
        <Info gamename="Table 1" startchips={this.state.game.startchips} blinds={this.state.game.smallblind} round={this.state.round} players={this.state.players} pots={this.state.round.pots}/>
        <Table cards={this.state.community} />
        <RevealedHands hands={this.state.revealed} />


         {/*
        {Object.keys(this.state.hands).map(key => <HoldCards key={key} playerId={key}  cards={this.state.hands[key]} />)}
        */}


        {/* {Object.keys(this.state.players).map(
          key => <PlayerUI key={key} id={key} player={this.state.players[key]}  cards={this.state.hands[key]}
          betChips={this.betChips}
          foldPlayer={this.foldPlayer}
          callBet={this.callBet}
          checkBet={this.checkBet}
          standPlayer={this.standPlayer}
          sitPlayer={this.sitPlayer} />
        )} */}

      </div>
    )
  }
}

export default App;
