import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './Components/Home/Home';
import RejectionMessage from './Components/RejectionMessage/RejectionMessage';
import SuccessMessage from './Components/SuccessMessage/SuccessMessage';
import Question from './Components/Question/Question';
import './App.scss';

function App() {
  return (
    <Router>
      <div className="App">
        <Route exact path="/" component={Home} />
        <Route path="/question/:question_number" render={props => <Question {...props} />} />
        <Route path="/rejection" render={props => <RejectionMessage {...props} />} />
        <Route path="/success" render={props => <SuccessMessage {...props} />} />
      </div>
    </Router>
  );
}

export default App;
