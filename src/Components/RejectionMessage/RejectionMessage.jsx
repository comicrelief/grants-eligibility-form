import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * IntroMessage class
 */
class RejectionMessage extends Component {

  constructor(props) {
    super(props);
  }

  /**
   * Render the form
   * @return {XML}
   */
  render() {
    return (
        <p>heres the RejectionMessage copy</p>
    );
  }
}

RejectionMessage.propTypes = {
  currentQuestion: PropTypes.number,
};

RejectionMessage.defaultProps = {
  currentQuestion: 0,
};

export default RejectionMessage;
