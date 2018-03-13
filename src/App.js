import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import IntroMessage from './Components/IntroMessage/IntroMessage';
import RejectionMessage from './Components/RejectionMessage/RejectionMessage';
import SuccessMessage from './Components/SuccessMessage/SuccessMessage';
import Question from './Components/Question/Question';


import PropTypes from 'prop-types'; // ES6
//import Validation from 'react-validation';
import './App.scss';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="content">
          <Route exact path="/" render={props => <IntroMessage {...props} />}/>
          <Route path="/question/:question_number" component={Question} />
          <Route path="/rejection" component={RejectionMessage} />
          <Route path="/success" component={SuccessMessage} />
        </div>
      </div>
    </Router>
  );
}

App.propTypes = {
  currentQuestion: PropTypes.number,
};

App.defaultProps = {
  currentQuestion: 0,
};

export default App;
