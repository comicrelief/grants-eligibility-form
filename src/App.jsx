/* eslint-env browser */
import React, { Component } from 'react';
import Raven from 'react-raven';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './Components/Home/Home';
import OutcomeMessage from './Components/OutcomeMessage/OutcomeMessage';
import Question from './Components/Question/Question';
import Error from './Components/Error/Error';

import './App.scss';

/**
 * App class
 */
class App extends Component {
  constructor(props) {
    super(props);
    this.resize = this.resize.bind(this);
  }

  resize() {
    console.log('Resize event');
    const formHeight = document.getElementById('grants-form') !== null
      ? document.getElementById('grants-form').clientHeight
      : '1000';

    setTimeout(function () {
      window.parent.postMessage('{"iframe_height":"' + formHeight + '"}', '*');
    }, 350);
  }

  /**
   * Render the App
   * @return {XML}
   */
  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/" render={props => <Home {...props} resize={this.resize} />} />
          <Route
            path="/question/:question_number"
            render={props => <Question {...props} resize={this.resize} />}
          />
          <Route
            path="/outcome/:outcome_number"
            render={props => <OutcomeMessage {...props} resize={this.resize} />}
          />
          <Route
            path="/error"
            render={props => <Error {...props} resize={this.resize} />}
          />
          <Raven dsn="https://174a79db7cf54ad2a03bafd2a075af8b@sentry.io/482571" />
        </div>
      </Router>
    );
  }
}

export default App;
