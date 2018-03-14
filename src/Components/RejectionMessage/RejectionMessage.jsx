import React, { Component } from 'react';
import propTypes from 'prop-types';

/**
 * IntroMessage class
 */
class RejectionMessage extends Component {
  
  /**
   * Render the RejectionMessage
   * @return {XML}
   */
  render() {
    return (
        <p>heres the RejectionMessage copy</p>
    );
  }
}

RejectionMessage.propTypes = {
  history: propTypes.shape({
    push: propTypes.func,
  }),
};

RejectionMessage.defaultProps = {
  history: { push: null },
};

export default RejectionMessage;
