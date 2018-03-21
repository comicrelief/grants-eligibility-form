import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './Components/Home/Home';
import OutcomeMessage from './Components/OutcomeMessage/OutcomeMessage';
import Question from './Components/Question/Question';
import './App.scss';

function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path="/" component={Home} />
        <Route path="/question/:question_number" render={props => <Question {...props} />} />
        <Route path="/outcome/:outcome_number" render={props => <OutcomeMessage {...props} />} />
      </div>
    </Router>
  );
}

export default App;
