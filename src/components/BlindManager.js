import React from 'react';


class BlindManager extends React.Component {

  idRef = React.createRef();

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

  render(){
    return (
      <form className="set-dealer" onSubmit={this.assignDealer}>
      <p>Set Dealer:</p>
      <select id="playerList" name="playerlist" ref={this.idRef}>
        {Object.keys(this.props.players).map(key => <option key={key} value={key} >{this.props.players[key].name}</option>)}
      </select>
      <button type="submit">Set Dealer</button>
      </form>
    )
  }
}

export default BlindManager;
