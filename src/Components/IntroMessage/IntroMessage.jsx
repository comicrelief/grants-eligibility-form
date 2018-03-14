import React, { Component } from 'react';
import propTypes from 'prop-types';

/**
 * IntroMessage class
 */
class IntroMessage extends Component {

  /**
   * Render the IntroMessage
   * @return {XML}
   */
  render() {
    return (
        <div>
          <p>Thanks for using our eligibility checker. We’re going to ask you a few questions about your organisation and what you need funding for. We’ll use these answers to see whether you might be eligible for an open initiative.</p>
          <a className="btn btn--red" href={'/question/' + this.props.current_question }>Start</a>
        </div>
    );
  }
}

export default IntroMessage;
