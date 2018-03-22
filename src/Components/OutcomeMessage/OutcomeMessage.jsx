import React, { Component } from 'react';
import propTypes from 'prop-types';
import Parser from 'html-react-parser';

// Import all of our template variants
import m1 from './templates/m1.html';
import m2 from './templates/m2.html';
import m3 from './templates/m3.html';
import m4 from './templates/m4.html';
import m5 from './templates/m5.html';
import m6 from './templates/m6.html';
import m7 from './templates/m7.html';
import m8 from './templates/m8.html';
import m9 from './templates/m9.html';
import m10 from './templates/m10.html';
import m11 from './templates/m11.html';
import m12 from './templates/m12.html';
import m13 from './templates/m13.html';
import m14 from './templates/m14.html';
import m15 from './templates/m15.html';

/**
 * OutcomeMessage class
 */
class OutcomeMessage extends Component {
  /**
   * Render the OutcomeMessage
   * @return {XML}
   */
  render() {
    /* Convert the current number to suit our zero-indexed array of messages */
    const currentMessage = this.props.match.params.outcome_number - 1;

    return (
      <div className="cr-body outcome-message">
        {Parser(this.props.messages[currentMessage])}
      </div>
    );
  }
}

OutcomeMessage.propTypes = {
  messages: propTypes.element,
  match: propTypes.shape({
    params: propTypes.shape({
      outcome_number: propTypes.string,
    }),
  }),
};

OutcomeMessage.defaultProps = {
  messages: [m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13, m14, m15],
  match: null,
};

export default OutcomeMessage;
