import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import IntroMessage from './Components/IntroMessage/IntroMessage';
import RejectionMessage from './Components/RejectionMessage/RejectionMessage';
import SuccessMessage from './Components/SuccessMessage/SuccessMessage';
import Question from './Components/Question/Question';


import PropTypes from 'prop-types'; // ES6
//import Validation from 'react-validation';
import './App.scss';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/" component={IntroMessage} />
          <Route path="/question/:qnum" component={Question} />
          <Route path="/rejection" component={RejectionMessage} />
          <Route path="/success" component={SuccessMessage} /> 
        </div>
      </Router>
    );
  }
}

export default App;
