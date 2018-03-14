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

  constructor(props) {
    super(props);

    this.state = {
      current_question: 1
    }
  }

  /**
   * Render the form
   * @return {XML}
   */
  render() {
    return (
      <Router>
        <div className="App">
          <div className="content">
            <Route exact path="/" render={() => <IntroMessage {...this.state} /> } />
            <Route path="/question/:question_number" render={ () => <Question {...this.state} /> } />
            <Route path="/rejection" render={ () => <IntroMessage {...this.state} /> } />
            <Route path="/success" render={ () => <SuccessMessage {...this.state} /> } />
          </div>
        </div>
      </Router>
    )
  }
}

export default App;
