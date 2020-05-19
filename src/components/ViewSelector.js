import React from 'react';
import { getFunName } from '../helpers';

class ViewSelector extends React.Component {

  myInput = React.createRef();

  goToUI = (e) => {
    e.preventDefault();
    // get text from input
    const table = this.myInput.current.value;
    // change page to /store/input-text
    this.props.history.push(`/table/${table}`);
  }

  render() {
    return (
      <form className="view-selector" onSubmit={this.goToUI}>
        { /* comment */}
        <h2>Enter table name</h2>
        <input type="text" required placeholder="Table Name" ref={this.myInput} defaultValue={getFunName()} />
        <button type="submit" >Join Table</button>
      </form>
    )
  }
}

export default ViewSelector;
