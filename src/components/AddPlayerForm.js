import React from 'react';


class AddPlayerForm extends React.Component {

  nameRef = React.createRef();
  avatarRef = React.createRef();
  pinRef = React.createRef();

  createPlayer = (e) => {
    e.preventDefault();
    const player = {
      name: this.nameRef.current.value,
      avatar: this.avatarRef.current.value,
      pin: parseInt(this.pinRef.current.value),
      cash: 5000,
      seated: false,
      active: false,
      folded: false
    }
    this.props.addPlayer(player);
    e.currentTarget.reset();
  };

  render(){
    const avatars = ["owl", "fox", "giraffe", "panda", "dog", "cat", "monkey", "raccoon", "wolf"];
    const final = [];

    for (let avatar of avatars) {
      final.push(<option value={avatar} key={avatar}>{avatar}</option>);
    }

    return (
      <form className="add-player" onSubmit={this.createPlayer}>
        <input name="name" ref={this.nameRef} type="text" placeholder="Player Name" />
        <select name="avatar" ref={this.avatarRef}>
          {final}
        </select>
        <input name="pin" ref={this.pinRef} type="text" placeholder="0000" />
        <button type="submit" >Add Player</button>
      </form>
    )
  }
}

export default AddPlayerForm;
