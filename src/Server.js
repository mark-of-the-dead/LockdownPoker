let freshDeck = require('./fresh-deck1');

// Dependencies
const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');

const fs = require('fs');

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

  create_UUID = () => {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
  }

state = {
  players: {},
  game: { 'smallblind' : 25, 'startchips' : 5000, gameID : create_UUID() },
  hands: {},
  community: {},
  round: {pots: [0], currentBet: 0},
  revealed: {},
  messages: {},
  deck: freshDeck,
};


saveState = () => {
  const path = '/tmp/ReactPoker/'+state.game.gameID+'-game-state.json';
  fs.writeFile(path, JSON.stringify(state), function(){
    //Game Saved
  });
}

loadState = (gameID) => {
  const path = '/tmp/ReactPoker/'+gameID+'-game-state.json';
  fs.readFile(path, 'utf8', function(err, data){
    state = JSON.parse(data);
  });
}

fs.mkdir('/tmp/ReactPoker', function(){
  setInterval(saveState, 60000);
});

addPlayer = (player) => {
  console.log('NEW PLAYER - ',player);
  state.players[`${Date.now()}`] = player;
}

showMsg = (msg, volume, flare) => {
  const msgID = Date.now();
  state.messages[msgID] = {
    text : msg,
    volume : volume,
    flare : flare
  };

  setTimeout(function(){
    delete state.messages[msgID]
  }, 4000)
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
  state.revealed[id] = {
    'name': state.players[id].name,
    'hand': ["back", "back"]
  };
  setTimeout(function(){
    delete state.revealed[id];
  }, 5000)
}

revealHand = (id, socket) => {
  if(parseInt(connections[socket]) === parseInt(id)){
    state.revealed[id] = {
      'name': state.players[id].name,
      'hand': state.hands[id]
    };
    state.players[id].revealed = true;
  }else{
    let tmpID = connections[socket];
    console.log('REVEAL log - ', state.players, id, socket, tmpID);
    if(tmpID && id && state.players.length>0){
      console.log(state.players[tmpID].name, 'is attempting to reveal hand for player - ', state.players[id].name);
    }
  }
}

rebuy = (id) => {
  state.players[id].cash += startchips;
}

assignDealer = (playerid) => {
  Object.keys(state.players).forEach(key => state.players[key].dealer = false);
  state.players[playerid].dealer = true;
  showMsg(state.players[playerid].name + ' is now Dealer', 'quiet', false);
}

resetSeatedPlayers = () => {
  Object.keys(state.players).forEach(key => {
    if(state.players[key].seated){
      state.players[key].folded = false;
    }else{
      state.players[key].folded = true;
    }
    state.players[key].revealed = false;
  })
}

sidePot = (amount) => {
  //amount = amount of last pot to move into sidepot (the bit some player can't win)
  const amt = amount ? parseInt(amount) : 0;
  state.round.pots.splice(0, 0, 0); //at index 0, without removing any items, add item zero;
  state.round.pots[1] -= amt;
  state.round.pots[0] += amt;
  showMsg('New side pot', 'quiet', false);
}

splitPot = (playerIDs, potID) => {
  lockBets();
  const payout = Math.floor(state.round.pots[potID] / playerIDs.length);
  playerIDs.forEach(
    key => {
      state.players[key].cash += payout;
      state.round.pots[potID] -= payout;
      showMsg(state.players[key].name + ' gets £' + payout, 'quiet', false);
    }
  );
  if(potID > 0){
    state.round.pots.splice(potID,1)
  }
}

moveMoney = (fromPlayer, toPlayer, amount) => {
  const amt = parseInt(amount);
  if(parseInt(state.players[fromPlayer].cash) > amt){
    state.players[fromPlayer].cash -= amt;
    state.players[toPlayer].cash += amt;
  }
  showMsg( amount + ' moved from ' + state.players[fromPlayer].name + ' to ' + state.players[fromPlayer].name, 'quiet', false);
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
  showMsg(state.players[player].name + ' checked', 'quiet', false);
}

betChips = (player, amount) => { // take blind into account?
  const amt = parseInt(amount)

  state.players[player].checked = false;
  state.players[player].cash = state.players[player].cash - amt;
  state.players[player]['currentBet'] = state.players[player]['currentBet'] + amt || amt;
  state.round.pots[0] = state.round.pots[0] + amt;
  console.log("Player '" + state.players[player].name + "'(ID:"+player+") wants to bet £" + amount);
  showMsg( state.players[player].name + ' bets £' + amount, 'quiet', false);

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
  showMsg('Dealing hold cards...', 'quiet', false);
  lockBets();
  resetSeatedPlayers();
  state.revealed = {};
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
  showMsg('Dealing the flop...', 'quiet', false);
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
  showMsg('Dealing turn card...', 'quiet', false);
  lockBets();

  const j = Math.floor(Math.random() * state.deck.length);
  state.community['turn'] = state.deck[j];
  state.deck.splice(j,1);
}

dealRiver = () => {
  showMsg('Dealing river card...', 'quiet', false);
  lockBets();

  const j = Math.floor(Math.random() * state.deck.length);
  state.community['river'] = state.deck[j];
  state.deck.splice(j,1);
}

loadSample = (sample) => {
  state.players = sample;
}

assignConnection = (id, pin, socket, autoassign) => {
  console.log('debug-',id, pin, socket, autoassign);
  if(id && pin){
    if(state.players[id]){
      if(!state.players[id].assigned){
        if(!connections[socket]){
          if(parseInt(state.players[id].pin) === parseInt(pin)){
            connections[socket] = id;
            state.players[id].assigned = true;
            console.log('connections-', connections);

            io.sockets.sockets[socket].emit('login success');
            showMsg(state.players[id].name + ' joined', 'quiet', false); // Repeats if user refreshes
  
            connections[socket].updateCycle = setInterval(function() {
              if(connections[socket] && io.sockets.sockets[socket]){
                const handObj = {};
                handObj[id] = state.hands[id];
                io.sockets.sockets[socket].emit('hand', {
                  hands : handObj
                });
              }
            }, 1000 / 30);
  
          }else{
            console.log('failed login as ' + state.players[id].name + ' from ' + socket);
          }
        }else{
          const currentid = connections[socket];
          console.log('socket already assigned player - ', state.players[currentid].name);
        }
      }else{
        console.log('player already assigned ', state.players[id].name, socket);
      }
    }
  }
}

assignTableConnection = (socket) => {
  if(!connections[socket]){
    connections[socket] = 'table';
  }
}

var connections = {};
io.on('connection', function(socket) {
  socket.on('new connection', function() {
    connections[socket.id] = '';
    // console.log('new connection - ', socket.id, ' : ', socket.handshake);
  });
  socket.on('add player', function(data) {
    const fixedVals = {
      cash: startchips,
      seated: false,
      active: false,
      folded: false,
      dealer: false,
      assigned: false,
      revealed: false
    }
    const player = {...data, ...fixedVals}
    addPlayer(player);
  });

  socket.on('stand player', standPlayer);
  socket.on('sit player', sitPlayer);
  socket.on('fold player', foldPlayer);
  socket.on('reveal', revealHand);
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
  socket.on('claim player', assignConnection);
  socket.on('loadgame', loadState);

  socket.on('disconnect', function() {
    if(connections[socket.id]){
      var id = connections[socket.id];
      state.players[id].assigned = false;
      clearInterval(connections[socket.id].updateCycle);
      delete connections[socket.id];
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
    // hands : state.hands,
    community : state.community,
    round : state.round,
    revealed : state.revealed,
    messages : state.messages,
    connections: connections
  });
}, 1000 / 2);

showMsg('Server Started', 'loud', false);

// setInterval(function() {
//   io.sockets.emit('hand', {
//     hands : state.hands // ALL HANDS
//   });
// }, 1000 / 30);
