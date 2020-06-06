import React from 'react';
import { getFunName } from '../helpers';

class ViewSelector extends React.Component {

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
      <div>
        {/* <form className="view-selector" onSubmit={this.goToUI}>
          <h2>Enter table name</h2>
          <input type="text" required placeholder="Table Name" ref={this.myInput} defaultValue={getFunName()} />
          <button type="submit" >Join Table</button>
        </form> */}
        <button type="submit" onClick={this.goToUI}>Table View</button>

        <select onChange={this.goToPlayer} ref={this.myInput}>
          <option value="" disabled selected>Player View</option>
          <option value="1">Mark</option>
          <option value="2">Andrew</option>
          <option value="3">Stephen</option>
          <option value="4">Dave</option>
          <option value="5">Kieran</option>
          <option value="6">Simon</option>
        </select>


      </div>
      
    )
  }
}

export default ViewSelector;
