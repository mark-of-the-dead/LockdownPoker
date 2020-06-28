import React from 'react';

import Info from './Info';
import Players from './Players';
import Table from './Table';

import samplePlayers from '../sample-players';
import freshDeck from '../fresh-deck';

import Messenger from './Messenger';

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
    revealed: {}
  };

  syncState = (data) => {
    this.setState({
      players: data.players,
      game: data.game,
      // hands: data.hands,
      community: data.community,
      round: data.round,
      revealed: data.revealed
    });
  }

  componentDidMount(){
    socket.on('state', this.syncState);

    socket.emit('new connection');
    socket.emit('table', socket.id );

  }

  // componentWillUnmount(){
  //   console.log('UNMOUNTING!');
  // }



  render(){
    return (
      <div className="react-poker tableview">
        <Players playerCount={Object.keys(this.state.players).length} players={this.state.players} />
        <Info gamename="Table 1" startchips={this.state.game.startchips} blinds={this.state.game.smallblind} round={this.state.round} players={this.state.players} pots={this.state.round.pots}/>
        <Table cards={this.state.community} />
        <RevealedHands hands={this.state.revealed} />
        <Messenger />
      </div>
    )
  }
}

export default App;
