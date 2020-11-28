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

// const server = window.location.protocol + '//' + window.location.hostname + ':5000'
const server = window.location.protocol + '//' + window.location.hostname + ':443';
// const server = 'http://shuffles.eu.ngrok.io';
let socket = io(server)

class Admin extends React.Component {

  state = {
    players: {},
    game: {},
    hands: {},
    community: {},
    round: {},
    deck: freshDeck,
    collapsibleSections: {player: '', blinds: '', payouts:''}
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

  gameIdRef = React.createRef();
  loadState = () => {
    socket.emit('loadgame', this.gameIdRef.current.value)
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
    for(let i=0;i<this.state.round.pots.length;i++){
      if(i<1){
        if(this.state.round.pots[i] > 20){
          console.log("Are you sure? there's still " + this.state.round.pots[i] + " in pot " + i);
          break;
        }
      }else{
        if(this.state.round.pots[i] > 0){
          console.log("Are you sure? there's still " + this.state.round.pots[i] + " in pot " + i);
          break;
        }
      }
    }
    socket.emit('deal hold');
    document.getElementById('setDealerForm').click(); //shortcut to auto-set dealer
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

  togglePlayerConfig = (e) => {
    let toggleState = this.state.collapsibleSections.player;
    this.setState({collapsibleSections: {
      blinds: this.state.collapsibleSections.blinds,
      payouts: this.state.collapsibleSections.payouts,
      player: toggleState == 'closed' ? '' : 'closed'}
    })
  }

  toggleBlinds = (e) => {
    let toggleState = this.state.collapsibleSections.blinds;
    this.setState({collapsibleSections: {
      player: this.state.collapsibleSections.player,
      payouts: this.state.collapsibleSections.payouts,
      blinds: toggleState == 'closed' ? '' : 'closed'}})
  }

  togglePayouts = (e) => {
    let toggleState = this.state.collapsibleSections.payouts;
    this.setState({collapsibleSections: {
      blinds: this.state.collapsibleSections.blinds,
      player: this.state.collapsibleSections.player,
      payouts: toggleState == 'closed' ? '' : 'closed'}})
  }

  render(){

    var pcClosed = '';

    return (
      <div className="react-poker admin">
        {/* <Players playerCount={Object.keys(this.state.players).length} players={this.state.players} />
        <Info gamename="Table 1" startchips={this.state.game.startchips} blinds={this.state.game.smallblind} round={this.state.round} players={this.state.players} pots={this.state.round.pots}/>
        <Table cards={this.state.community} /> */}


        <h3 className="admin-title collapsible" onClick={this.togglePlayerConfig}>Player Form</h3>
        <div className={`player-config ${this.state.collapsibleSections.player}`}>
          <AddPlayerForm addPlayer={this.addPlayer} />
          <button onClick={this.loadSample}>Load Sample</button>
          <button onClick={this.resetSeatedPlayers}>reset Players</button>
        </div>
        
        <div className="hand-controls">
          <button onClick={this.dealHold}>Deal new hand</button>
          <button onClick={this.dealFlop}>Deal flop</button>
          <button onClick={this.dealTurn}>Deal turn</button>
          <button onClick={this.dealRiver}>Deal river</button>
        </div>
        
        <h3 className="admin-title collapsible" onClick={this.toggleBlinds}>Dealer / Blinds</h3>
        <div className={`blind-management ${this.state.collapsibleSections.blinds}`}>
          <BlindManager players={this.state.players} assignDealer={this.assignDealer} blinds={this.state.game.smallblind} betChips={this.betChips} />
        </div>

        <h3 className="admin-title collapsible" onClick={this.togglePayouts}>Payouts</h3>
        <div className={`money-transfers ${this.state.collapsibleSections.payouts}`}>
          <MoneyManager players={this.state.players} pots={this.state.round.pots} splitPot={this.splitPot} sidePot={this.sidePot} moveMoney={this.moveMoney} />
        </div>

<hr/>
        <input name="gameId" ref={this.gameIdRef} type="text" placeholder="Game ID" />
        <button onClick={this.loadState}>Load game</button>

<hr/>
        {/*
        {Object.keys(this.state.hands).map(key => <HoldCards key={key} playerId={key}  cards={this.state.hands[key]} />)}
        */}



      </div>
    )
  }
}



export default Admin;
