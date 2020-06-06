import React from 'react';


class MoneyManager extends React.Component {

  idRef = React.createRef();
  potRef = React.createRef();

  idRefFrom = React.createRef();
  idRefTo = React.createRef();
  amtRef = React.createRef();

  cashout = (e) => {
    e.preventDefault();
    const playerlistElem = document.getElementById("playerList2");
    const arr = [...playerlistElem.options].filter(option => option.selected).map(option => option.value);
    this.props.splitPot(arr, this.potRef.current.value);
    e.currentTarget.reset();
  }

  movemoney = (e) => {
    e.preventDefault();
    this.props.moveMoney(this.idRefFrom.current.value, this.idRefTo.current.value, this.amtRef.current.value);
    e.currentTarget.reset();
  }

  render(){
    const pots = this.props.pots || {};

    return (
      <div>
        <form className="split-pot" onSubmit={this.cashout}>
        <p>Payout from pot
        <select name="potlist" ref={this.potRef}>
          {Object.keys(pots).map(key => <option key={key} value={key} >({key})-&pound;{pots[key]}</option>)}
        </select>
        :</p>
        <select id="playerList2" name="playerlist" ref={this.idRef} multiple>
          {Object.keys(this.props.players).map(key => <option key={key} value={key} >{this.props.players[key].name}</option>)}
        </select>
        <button type="submit">Pay now</button>
        </form>

        <form className="money-money" onSubmit={this.movemoney}>
        <p>Move Money:</p>
        <select id="playerList2" name="playerlist1" ref={this.idRefFrom}>
          {Object.keys(this.props.players).map(key => <option key={key} value={key} >{this.props.players[key].name}</option>)}
        </select>
        &nbsp; &gt; &nbsp;
        <select id="playerList2" name="playerlist2" ref={this.idRefTo}>
          {Object.keys(this.props.players).map(key => <option key={key} value={key} >{this.props.players[key].name}</option>)}
        </select>
        &nbsp;
        <input type="text" name="moveamount" ref={this.amtRef}/>
        <button type="submit">Move now</button>
        </form>
      </div>
    )
  }
}

export default MoneyManager;
