import React from 'react';
// import Player from './PlayerHand';


class RevealedHands extends React.Component {
  render(){
    return (
      <div className="reveal-list">
        <ul>
        <li className="revealedhand">
            Mark
            <span className='revealcard back'></span>
            <span className='revealcard back'></span>
          </li>

          <li className="revealedhand">
            Dave
            <span className='revealcard back'></span>
            <span className='revealcard back'></span>
          </li>

          <li className="revealedhand">
            Stephen
            <span className='revealcard SA'></span>
            <span className='revealcard CA'></span>
          </li>
          
          {/* {Object.keys(this.props.hands).map(key => <RevealedHand key={key} details={this.props.hands[key]} />)} */}
          {Object.keys(this.props.hands).map(key => this.props.hands[key])}
        </ul>
      </div>
    )
  }
}

export default RevealedHands;
