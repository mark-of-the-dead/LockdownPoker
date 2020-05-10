let freshDeck = require('./fresh-deck1');

// Dependencies
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

const startchips = 5000;

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));


// Routing
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
  });

  // Starts the server.
server.listen(5000, function() {
    console.log('Starting server on port 5000');
  });


state = {
  players: {},
  game: { 'smallblind' : 25, 'startchips' : 5000 },
  hands: {},
  community: {},
  round: {pots: [0], currentBet: 0},
  deck: freshDeck
};

addPlayer = (player) => {
  state.players[`${Date.now()}`] = player;
}

standPlayer = (id) => {
  state.players[id].seated = false;
}

sitPlayer = (id) => {
  state.players[id].seated = true;
}

foldPlayer = (id) => {
  state.players[id].folded = true;
  state.players[id].checked = false;
}

rebuy = (id) => {
  state.players[id].cash += startchips;
}

assignDealer = (playerid) => {
  Object.keys(state.players).forEach(key => state.players[key].dealer = false);
  state.players[playerid].dealer = true;
}

resetSeatedPlayers = () => {
  Object.keys(state.players).forEach(key => {
    if(state.players[key].seated){
      state.players[key].folded = false;
    }else{
      state.players[key].folded = true;
    }
  })
}

sidePot = (amount) => {
  //amount = amount of last pot to move into sidepot (the bit some player can't win)
  const amt = amount ? parseInt(amount) : 0;
  state.round.pots.splice(0, 0, 0); //at index 0, without removing any items, add item zero;
  state.round.pots[1] -= amt;
  state.round.pots[0] += amt;
}

splitPot = (playerIDs, potID) => {
  const payout = Math.floor(state.round.pots[potID] / playerIDs.length);
  playerIDs.forEach(
    key => {
      state.players[key].cash += payout;
      state.round.pots[potID] -= payout;
    }
  );
}

moveMoney = (fromPlayer, toPlayer, amount) => {
  const amt = parseInt(amount);
  if(parseInt(state.players[fromPlayer].cash) > amt){
    state.players[fromPlayer].cash -= amt;
    state.players[toPlayer].cash += amt;
  }
}

movePotMoney = (fromPot, toPot, amount) => {
  const amt = parseInt(amount);
  if(typeof state.round.pots[fromPot] !== 'undefined' && typeof state.round.pots[toPot] !== 'undefined' && parseInt(state.round.pots[fromPot]) >= amt){
    state.round.pots[fromPot] -= amt;
    state.round.pots[toPot] += amt;
  }
}

lockBets = () => {
  state.round['currentBet'] = 0;
  Object.keys(state.players).forEach(
    key => {
      state.players[key].currentBet = 0;
      state.players[key].checked = false;
    }
  );
}

checkBet = (player) => {
  state.players[player].checked = true;
}

betChips = (player, amount) => {
  const amt = parseInt(amount)

  state.players[player].checked = false;
  state.players[player].cash = state.players[player].cash - amt;
  state.players[player]['currentBet'] = state.players[player]['currentBet'] + amt || amt;
  state.round.pots[0] = state.round.pots[0] + amt;
  console.log("Player '" + state.players[player].name + "'(ID:"+player+") wants to bet £" + amount);

  let currentHighestBet = 0;
  Object.keys(state.players).forEach(
    key => currentHighestBet = state.players[key].currentBet > currentHighestBet ? state.players[key].currentBet : currentHighestBet
  );

  state.round['currentBet'] = currentHighestBet;

}

callBet = (player) => {
  betChips(player, state.players[player].currentBet ? state.round.currentBet - state.players[player].currentBet : state.round.currentBet);
}



dealHold = () => {
  state.deck = JSON.parse(JSON.stringify(freshDeck));

  console.log(state.deck); 
  let handsObj = {};
  const communityObj = {};
  Object.keys(state.players).map(key => {
    if(state.players[key].seated && !state.players[key].folded){
      let arr = [];
      for(let i=0;i<2;i++){
        const j = Math.floor(Math.random() * state.deck.length);
        arr[i] = state.deck[j];
        state.deck.splice(j,1);
      }
      handsObj[key] = arr;
    }
  });
  console.log(handsObj, communityObj);
  state.hands = handsObj;
  state.community = communityObj;
}

dealFlop = () => {
  lockBets();
  let arr = [];
  for(let i=0;i<3;i++){
    const j = Math.floor(Math.random() * state.deck.length);
    arr[i] = state.deck[j];
    state.deck.splice(j,1);
  }
  state.community['flop'] = arr;

}

dealTurn = () => {
  lockBets();

  const j = Math.floor(Math.random() * state.deck.length);
  state.community['turn'] = state.deck[j];
  state.deck.splice(j,1);
}

dealRiver = () => {
  lockBets();

  const j = Math.floor(Math.random() * state.deck.length);
  state.community['river'] = state.deck[j];
  state.deck.splice(j,1);
}

loadSample = (sample) => {
  state.players = sample;
}

var connections = {};
io.on('connection', function(socket) {
  socket.on('new connection', function() {
    connections[socket.id] = {};
  });
  socket.on('add player', function(data) {
    const fixedVals = {
      cash: startchips,
      seated: false,
      active: false,
      folded: false,
      dealer: false
    }
    const player = {...data, ...fixedVals}
    addPlayer(player);
  });

  socket.on('stand player', standPlayer);
  socket.on('sit player', sitPlayer);
  socket.on('fold player', foldPlayer);
  socket.on('reset players', resetSeatedPlayers);
  socket.on('rebuy', rebuy);
  socket.on('sidepot', sidePot);
  socket.on('splitPot', splitPot);
  socket.on('move money', moveMoney);
  socket.on('move pmoney', movePotMoney);
  socket.on('lock bets', lockBets);
  socket.on('check bet', checkBet);
  socket.on('call bet', callBet);
  socket.on('bet', betChips);
  socket.on('deal hold', dealHold);
  socket.on('deal flop', dealFlop);
  socket.on('deal turn', dealTurn);
  socket.on('deal river', dealRiver);
  socket.on('load sample', loadSample);
  socket.on('assign dealer', assignDealer);

  socket.on('disconnect', function() {
    if(connections[socket.id]){
      delete connections[socket.id]
    }
    // remove disconnected player
  });

  // socket.on('movement', function(data) {
  //   var player = players[socket.id] || {};
  //   if (data.left) {
  //     player.x -= 5;
  //   }
  // });
});

setInterval(function() {
  io.sockets.emit('state', {
    players : state.players,
    game : state.game,
    hands : state.hands,
    community : state.community,
    round : state.round,
    connections: connections
  });
}, 1000 / 30);
