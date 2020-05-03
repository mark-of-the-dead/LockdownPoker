import React from 'react';
import { getFunName } from '../helpers';

class TablePicker extends React.Component {

  myInput = React.createRef();

  goToTable = (e) => {
    e.preventDefault();
    // get text from input
    const table = this.myInput.current.value;
    // change page to /store/input-text
    this.props.history.push(`/table/${table}`);
  }

  render() {
    return (
      <form className="table-selector" onSubmit={this.goToTable}>
        { /* comment */}
        <h2>Enter table name</h2>
        <input type="text" required placeholder="Table Name" ref={this.myInput} defaultValue={getFunName()} />
        <button type="submit" >Join Table</button>
      </form>
    )
  }
}

export default TablePicker;
