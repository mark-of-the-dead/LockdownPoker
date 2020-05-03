import React from 'react';
import AddPlayerForm from './AddPlayerForm';

class Admin extends React.Component {


  render() {
    return (
      <div>
        <h2>ADMIN PAGE</h2>
        <AddPlayerForm addPlayer={this.addPlayer} />
        <button onClick={this.loadSample}>Load Sample</button>
      </div>

    )
  }
}

export default Admin;
