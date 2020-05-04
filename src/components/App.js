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
    round: {pots: [0], currentBet: 0},
    deck: freshDeck
  };


  addPlayer = (player) => {
    const players = {...this.state.players}
    players[`${Date.now()}`] = player;
    this.setState({
      players: players //players also works where names are the same
    });
  }

  loadSample = () => {
    this.setState({
      players: samplePlayers
    });
  }

  resetDeck = () => {
    const newdeck = JSON.parse(JSON.stringify(freshDeck));

    this.setState({
      deck: newdeck
    });

  }

  dealHold = () => {
    const deck = JSON.parse(JSON.stringify(freshDeck));

    let handsObj = {};
    const communityObj = {};
    Object.keys(this.state.players).map(key => {
      if(this.state.players[key].seated && !this.state.players[key].folded){
        let arr = [];
        for(let i=0;i<2;i++){
          const j = Math.floor(Math.random() * deck.length);
          arr[i] = deck[j];
          deck.splice(j,1);
        }
        handsObj[key] = arr;
      }
    });
    this.setState({
      hands: handsObj,
      community: communityObj,
      deck: deck
    });
  }

  dealFlop = () => {
    this.lockBets();
    const {community, deck} = this.state;
    let arr = [];
    for(let i=0;i<3;i++){
      const j = Math.floor(Math.random() * deck.length);
      arr[i] = deck[j];
      deck.splice(j,1);
    }
    community['flop'] = arr;

    this.setState({
      community: community,
      deck: deck
    });
  }

  dealTurn = () => {
    this.lockBets();
    const {community, deck} = this.state;

    const j = Math.floor(Math.random() * deck.length);
    community['turn'] = deck[j];
    deck.splice(j,1);

    this.setState({
      community: community,
      deck: deck
    });
  }

  dealRiver = () => {
    this.lockBets();
    const {community, deck} = this.state;

    const j = Math.floor(Math.random() * deck.length);
    community['river'] = deck[j];
    deck.splice(j,1);

    this.setState({
      community: community,
      deck: deck
    });
  }

  betChips = (player, amount) => {
    const {players, round, hands} = this.state;
    const amt = parseInt(amount)

    players[player].checked = false;
    players[player].cash = players[player].cash - amt;
    players[player]['currentBet'] = players[player]['currentBet'] + amt || amt;
    round.pots[0] = round.pots[0] + amt;
    console.log("Player '" + players[player].name + "'(ID:"+player+") wants to bet £" + amount);

    let currentHighestBet = 0;
    Object.keys(players).forEach(
      key => currentHighestBet = players[key].currentBet > currentHighestBet ? players[key].currentBet : currentHighestBet
    );

    round['currentBet'] = currentHighestBet;

    this.setState({
      players,
      round,
      hands
    });
  }

  foldPlayer = (player) => {
    const {players} = this.state;
    players[player].folded = true;
    players[player].checked = false;
    this.setState({
      players
    });
  }

  assignDealer = (playerid) => {
    const {players} = this.state;
    Object.keys(players).forEach(key => players[key].dealer = false);
    players[playerid].dealer = true;
    this.setState({
      players
    });
  }
  

  callBet = (player) => {
    this.betChips(player, this.state.players[player].currentBet ? this.state.round.currentBet - this.state.players[player].currentBet : this.state.round.currentBet);
  }

  checkBet = (player) => {
    const {players} = this.state;
    players[player].checked = true;
    this.setState({
      players
    });
  }

  lockBets = () => {
    const {players, round} = this.state;
    round['currentBet'] = 0;
    Object.keys(players).forEach(
      key => {
        players[key].currentBet = 0;
        players[key].checked = false;
      }
    );
    this.setState({
      players,
      round
    });
  }

  resetSeatedPlayers = () => {
    const {players} = this.state;
    Object.keys(players).forEach(key => {
      if(players[key].seated){
        players[key].folded = false;
      }else{
        players[key].folded = true;
      }
    })
    this.setState({
      players
    });
  }

  standPlayer = (playerid) => {
    const {players} = this.state;
    players[playerid].seated = false;
    this.setState({
      players
    });
  }

  sitPlayer = (playerid) => {
    const {players} = this.state;
    players[playerid].seated = true;
    this.setState({
      players
    });
  }

  startNewHand = () => {
    this.resetSeatedPlayers();
    this.dealHold();
  }


  // next = (db, key) => {
  //   const keys = Object.keys(db)
  //     , i = keys.indexOf(key);
  //   // if(db[keys[i + 1]].folded || !db[keys[i + 1]].seated){
  //   //   console.log('player not in this round');
  //   // }else{
  //     return i !== -1 && keys[i + 1] && keys[i + 1];
  //   // }
  // }

  // setActivePlayer = () => {
  //   const {players} = this.state;
  //   let activePlayerID = 0;
  //   let i = 0;
  //   let activePlayerIndex = 0;
  //   Object.keys(players).forEach(key => {
  //     i++
  //     if(players[key].active){
  //       activePlayerID = key;
  //       activePlayerIndex = i;
  //     }
  //   })
  //   if(activePlayerID > 0){
  //     players[activePlayerID].active = false;
  //     if(activePlayerIndex < Object.keys(players).length){
  //       players[this.next(players, activePlayerID)].active = true;
  //     }else{
  //       players[Object.keys(players)[0]].active = true;
  //     }
  //   }else{
  //     players[Object.keys(players)[0]].active = true; //make first player active. should actually be person with blind chip
  //   }

  //   this.setState({
  //     players
  //   });
  // }

  splitPot = (playerIDs, potID) => {
    const {players, round} = this.state;
    const payout = Math.floor(round.pots[potID] / playerIDs.length);
    playerIDs.forEach(
      key => {
        players[key].cash += payout;
        round.pots[potID] -= payout;
      }
    );
    this.setState({
      players,
      round
    });
  }

  moveMoney = (fromPlayer, toPlayer, amount) => {
    const {players} = this.state;
    const amt = parseInt(amount);
    if(parseInt(players[fromPlayer].cash) > amt){
      players[fromPlayer].cash -= amt;
      players[toPlayer].cash += amt;
    }
    this.setState({
      players
    });
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
        <Players playerCount={Object.keys(this.state.players).length} players={this.state.players} />
        <Info gamename="Table 1" startchips={5000} round={this.state.round} players={this.state.players} pots={this.state.round.pots}/>
        <Table cards={this.state.community} />

<hr/>

        <AddPlayerForm addPlayer={this.addPlayer} />
        <button onClick={this.loadSample}>Load Sample</button>
        <button onClick={this.dealHold}>Deal new hand</button>
        <button onClick={this.dealFlop}>Deal flop</button>
        <button onClick={this.dealTurn}>Deal turn</button>
        <button onClick={this.dealRiver}>Deal river</button>
        <BlindManager players={this.state.players} assignDealer={this.assignDealer} betChips={this.betChips} />
        <MoneyManager players={this.state.players} pots={this.state.round.pots} splitPot={this.splitPot} />


<hr/>
        {/*
        {Object.keys(this.state.hands).map(key => <HoldCards key={key} playerId={key}  cards={this.state.hands[key]} />)}
        */}

<hr/>

        {Object.keys(this.state.players).map(
          key => <PlayerUI key={key} id={key} player={this.state.players[key]}  cards={this.state.hands[key]}
          betChips={this.betChips}
          foldPlayer={this.foldPlayer}
          callBet={this.callBet}
          checkBet={this.checkBet}
          standPlayer={this.standPlayer}
          sitPlayer={this.sitPlayer} />
        )}

      </div>
    )
  }
}

export default App;
