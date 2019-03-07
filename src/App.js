import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {

  state = {
    manager: '',
    players: [],
    balance: '',
    lastWinner: '',
    value: '',
    message: ''
  };

  async componentDidMount(){
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    const lastWinner = await lottery.methods.lastWinner().call();

    this.setState({manager, players, balance, lastWinner});
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({message: 'Waiting on transaction success...'});

    await lottery.methods.enter().send( {
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({message: 'You have been entered!'});
  };

  onClick = async (event) => {
    const accounts = await web3.eth.getAccounts();

    this.setState({message: 'Waiting on tranction success...'});

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({message: 'A winner has been picked!'});

    const lastWinner = await lottery.methods.lastWinner().call();
    this.setState({message: 'A winner has been picked! and winner is '+lastWinner});
  };


  render() {
    return (
     <div>
       <h2>Lottery Contract</h2>
       <p>
         This contact is managed by {this.state.manager}. 
         <br/>There are currently {this.state.players.length} people entered, 
         competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether! 
         <br/>Last winner: {this.state.lastWinner}
        </p>

        <hr/>

        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input value={this.state.value} 
              onChange={event => this.setState({value: event.target.value})} />
          </div>
          <button>Enter</button>
        </form>

        <hr/>
          <h4>Ready to pick winner?</h4>
          <button onClick={this.onClick}>Pick a winner!</button>

        <hr/>

        <h1>{this.state.message}</h1>
     </div>
    );
  }
}

export default App;
