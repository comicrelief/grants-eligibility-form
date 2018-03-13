import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * IntroMessage class
 */
class IntroMessage extends Component {

  /**
   * Render the form
   * @return {XML}
   */
  render() {
    return (
        <div>
          <p>heres the intro copy</p>
          <a href='/question/1'>Start</a>
        </div>
    );
  }
}

export default IntroMessage;
