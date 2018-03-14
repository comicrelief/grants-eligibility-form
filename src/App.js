import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import IntroMessage from './Components/IntroMessage/IntroMessage';
import RejectionMessage from './Components/RejectionMessage/RejectionMessage';
import SuccessMessage from './Components/SuccessMessage/SuccessMessage';
import Question from './Components/Question/Question';
import propTypes from 'prop-types';
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
            <Route path="/question/:question_number" render={ ()=> <Question {...this.state} nextQuestion={function(e){ this.nextQuestion(e);}.bind(this)}/> } />
            <Route path="/rejection" render={ () => <RejectionMessage  {...this.state} /> } />
            <Route path="/success" render={ () => <SuccessMessage {...this.state} /> } />
          </div>
        </div>
      </Router>
    )
  }

  nextQuestion (e) {
    console.log("next question!", e);

    let currentQuestion = this.state.current_question;
    currentQuestion++;

    this.setState({
      current_question: currentQuestion
    });
  };
}

export default App;
