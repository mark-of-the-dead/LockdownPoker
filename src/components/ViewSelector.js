import React from 'react';
import { getFunName } from '../helpers';

import io from 'socket.io-client'

const server = window.location.protocol + '//' + window.location.hostname + ':5000'
// const server = 'http://shuffles.eu.ngrok.io';
let socket = io(server);

class ViewSelector extends React.Component {

  state = {
    players: {}
  };

  syncState = (data) => {
    this.setState({
      players: data.players
    });
  }


  componentDidMount(){
    socket.on('state', this.syncState);
  }

  myInput = React.createRef();

  goToUI = (e) => {
    e.preventDefault();
    // get text from input
    // const table = this.myInput.current.value;
    const table = 'mw1';
    // change page to /store/input-text
    this.props.history.push(`/table/${table}`);
  }

  goToPlayer = (e) => {
    e.preventDefault();
    // get text from input
    const player = this.myInput.current.value;
    this.props.history.push(`/player/${player}`);
  }

  render() {
    return (
      <div className='view-selection'>
        {/* <form className="view-selector" onSubmit={this.goToUI}>
          <h2>Enter table name</h2>
          <input type="text" required placeholder="Table Name" ref={this.myInput} defaultValue={getFunName()} />
          <button type="submit" >Join Table</button>
        </form> */}
        {/* <button type="submit" onClick={this.goToUI}>Table View</button> */}



        <ul className="view-selector">
          <li className="btn-tableview" onClick={this.goToUI}>Go To Table</li>
          {/* <li className="btn-handview">
            View Hand
            
          </li> */}
        </ul>
        View Player: <select onChange={this.goToPlayer} ref={this.myInput}>
              <option value="" disabled selected>Player View</option>
              {Object.keys(this.state.players).map(key => <option key={key} value={key}>{this.state.players[key].name}</option>)}
            </select>

<hr/>

        <h2>Table 1</h2>
        <ul>
        {Object.keys(this.state.players).map(key => <li key={key}>{this.state.players[key].name}</li>)}
        </ul>

      </div>
      
    )
  }
}

export default ViewSelector;
