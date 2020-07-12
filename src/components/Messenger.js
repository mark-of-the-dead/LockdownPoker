import React from 'react';
import Message from './Message';

class Messenger extends React.Component {
  render(){
    return (
      <div className="message-holder">
        {Object.keys(this.props.messages).map(key => <Message key={key} type={this.props.messages[key].volume} message={this.props.messages[key].text} />)}
          {/* <Message type="quiet" message="Hold cards dealt"/>
          <Message type="quiet" message="Dealing Flop..."/>
          <Message type="quiet" message="Mark bet £100"/>
          <Message type="quiet" message="Stephen bet £100"/>
          <Message type="quiet" message="Mark revealed his hand"/>
          <Message type="loud" message="Mark won!"/> */}
        </div>
    )
  }
}

export default Messenger;
