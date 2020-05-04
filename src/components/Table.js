import React from 'react';

class Table extends React.Component {
  // {Object.keys(this.props.cards['flop']).map(key => this.props.cards[key])}
  render(){

    const flop = this.props.cards['flop'] ? Object.keys(this.props.cards['flop']).map(
      key => this.props.cards['flop'] ? <li key={key} className={`table-card ${this.props.cards['flop'][key]}`}>{this.props.cards['flop'][key]}</li> : ''
    ) : '';
    const turn = this.props.cards['turn'] ? <li className={`table-card ${this.props.cards['turn']}`}>{this.props.cards['turn']}</li> : '';
    const river = this.props.cards['river'] ? <li className={`table-card ${this.props.cards['river']}`}>{this.props.cards['river']}</li> : '';


    return (
      <div className="table">
        <ul>
          {flop}
          {turn}
          {river}
        </ul>
      </div>
    )
  }
}

export default Table;
