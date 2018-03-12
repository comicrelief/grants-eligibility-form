import React, { Component } from 'react';
import PropTypes from 'prop-types'; // ES6
//import Validation from 'react-validation';
import './App.scss';

class App extends Component {
  render() {
    return (
      <div className="App">
        <form>
          <label htmlFor="firstname">firstname</label>
          <input type="text" name="firstname"/><br/>
          <label htmlFor="lastname">lastname</label>
          <input type="text" name="lastname"/>
        </form>
      </div>
    );
  }
}

export default App;
