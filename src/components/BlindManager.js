import React from 'react';


class BlindManager extends React.Component {

  idRef = React.createRef();
  blindRef = React.createRef();
  bigBlindRef = React.createRef();

  assignDealer = (e) => {
    e.preventDefault();
    this.props.assignDealer(this.idRef.current.value);
    const playerlistElem = document.getElementById("playerList");
    if(playerlistElem.selectedIndex < playerlistElem.options.length-1){
      playerlistElem.selectedIndex++;
    }else{
      playerlistElem.selectedIndex = 0;
    }
  }

  payBlinds = (e) => {
    e.preventDefault();
    this.props.betChips(this.blindRef.current.value, 25);
    this.props.betChips(this.bigBlindRef.current.value, 50);
  }

  render(){
    return (
      <React.Fragment>
      <form className="set-dealer" onSubmit={this.assignDealer}>
        <p>Set Dealer:</p>
        <select id="playerList" name="playerlist" ref={this.idRef}>
          {Object.keys(this.props.players).map(key => <option key={key} value={key} >{this.props.players[key].name}</option>)}
        </select>
        <button type="submit">Set Dealer</button>
        </form>
        <form className="set-blinds" onSubmit={this.payBlinds}>
        <p>Set Blinds:</p>
        <select id="playerListBlind" name="playerlistBlind" ref={this.blindRef} multiple>
          {Object.keys(this.props.players).map(
            key => this.props.players[key].seated ? <option key={key} value={key} >{this.props.players[key].name}</option> : ''
          )}
        </select>
        <select id="playerListBigBlind" name="playerListBigBlind" ref={this.bigBlindRef} multiple>
          {Object.keys(this.props.players).map(
            key => this.props.players[key].seated ? <option key={key} value={key} >{this.props.players[key].name}</option> : ''
          )}
        </select>
        <button type="submit">Force Blinds</button>
      </form>
      </React.Fragment>
    )
  }
}

export default BlindManager;
