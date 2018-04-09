import React from 'react';
import Raven from 'react-raven';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './Components/Home/Home';
import OutcomeMessage from './Components/OutcomeMessage/OutcomeMessage';
import Question from './Components/Question/Question';
import Error from './Components/Error/Error';

import './App.scss';

function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path="/" component={Home} />
        <Route path="/question/:question_number" render={props => <Question {...props} />} />
        <Route path="/outcome/:outcome_number" render={props => <OutcomeMessage {...props} />} />
        <Route path="/error" render={props => <Error {...props} />} />
        <Raven dsn="https://174a79db7cf54ad2a03bafd2a075af8b@sentry.io/482571" />
      </div>
    </Router>
  );
}

export default App;
