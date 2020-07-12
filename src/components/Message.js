import React from 'react';


class Messenge extends React.Component {
  render(){
    const msgclass = "message-" + this.props.type;
    return (
      <div className={`message ${msgclass}`}>
        <p>{this.props.message}</p>
      </div>
    )
  }
}

export default Messenge;
