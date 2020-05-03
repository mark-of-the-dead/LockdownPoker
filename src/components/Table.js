import React from 'react';

class Table extends React.Component {
  // {Object.keys(this.props.cards['flop']).map(key => this.props.cards[key])}
  render(){
    return (
      <p>{this.props.cards['flop']} | {this.props.cards['turn']} | {this.props.cards['river']}</p>
    )
  }
}

export default Table;
