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

  reveal = () => {
    this.props.revealHand(this.props.id);
  }

  call = () => {
    this.props.callBet(this.props.id);
  }
  check = () => {
    this.props.checkBet(this.props.id);
  }

  stand = () => {
    this.props.standPlayer(this.props.id);
  }

  sit = () => {
    this.props.sitPlayer(this.props.id);
  }


  render(){
    const player = this.props.player || {};
    let card1, card2, addClass;
    if(this.props.cards){
      card1 = this.props.cards[0];
      card2 = this.props.cards[1];
      addClass = ''
    }else{
      addClass = ' blank'
    }
    return (
      <React.Fragment>
        <div className="player-ui">
          {/* {player.name}({this.props.id}) */}
          <div className="hold-cards">
            <span className={`holdcard ${card1}${addClass}`}>{card1}</span>
            <span className={`holdcard ${card2}${addClass}`}>{card2}</span>
          </div>
          {!player.currentBet ? <button className='btn btn-check' onClick={this.check}>Check</button> : null }
          <input type="range" min="0" max="1000" step="5"
            className="slider" name="amount" id="amountSlider" onInput={this.updateAmount} ref={this.amountRef} />
          <span className='slider-label'>{this.state.amountLabel}</span>
          <br/>
          <button className='btn btn-bet' onClick={this.placeBet}>Bet</button>
          <br/>
          <button className='btn btn-call' onClick={this.call}>Call</button>
          <button className='btn btn-fold' onClick={this.fold}>Fold</button>
          <br/>
          <button className='btn btn-reveal' onClick={this.reveal}>Reveal</button>
          
          <br/>
          {player.seated ? <button className='btn btn-stand' onClick={this.stand}>Sit Out</button> : <button className='btn btn-sit' onClick={this.sit}>Sit Down</button> }
        </div>
        <hr />
      </React.Fragment>
    )
  }
}

export default PlayerUI;
