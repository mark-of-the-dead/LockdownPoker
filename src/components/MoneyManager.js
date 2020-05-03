import React from 'react';


class MoneyManager extends React.Component {

  idRef = React.createRef();
  potRef = React.createRef();

  cashout = (e) => {
    e.preventDefault();
    const playerlistElem = document.getElementById("playerList2");
    const arr = [...playerlistElem.options].filter(option => option.selected).map(option => option.value);
    this.props.splitPot(arr, this.potRef.current.value);
    e.currentTarget.reset();
  }

  render(){
    return (
      <form className="set-dealer" onSubmit={this.cashout}>
      <p>Payout from pot 
      <select name="potlist" ref={this.potRef}>
        {Object.keys(this.props.pots).map(key => <option key={key} value={key} >({key})-&pound;{this.props.pots[key]}</option>)}
      </select>
      :</p>
      <select id="playerList2" name="playerlist" ref={this.idRef} multiple>
        {Object.keys(this.props.players).map(key => <option key={key} value={key} >{this.props.players[key].name}</option>)}
      </select>
      <button type="submit">Pay now</button>
      </form>
    )
  }
}

export default MoneyManager;
