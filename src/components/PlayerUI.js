import React from 'react';


class PlayerUI extends React.Component {

  amountRef = React.createRef();
  state = {
    amountLabel : 50
  };

  updateAmount = (e) => {
    this.setState({
      amountLabel : this.amountRef.current.value
    })
  }

  placeBet = () => {
    this.props.betChips(this.props.id,this.amountRef.current.value);
  }

  fold = () => {
    this.props.foldPlayer(this.props.id);
  }

  call = () => {
    this.props.callBet(this.props.id);
  }


  render(){
    const player = this.props.player || {};
    return (
      <React.Fragment>
        <div className="player-ui">
          {player.name}({this.props.id})
          <button onClick={this.call}>Call</button>
          <button onClick={this.placeBet}>Bet</button>
          <input type="range" min="0" max="1000" step="5"
            className="slider" name="amount" id="amountSlider" onInput={this.updateAmount} ref={this.amountRef} />{this.state.amountLabel}
          <button onClick={this.fold}>Fold</button>
        </div>
        <hr />
      </React.Fragment>
    )
  }
}

export default PlayerUI;
