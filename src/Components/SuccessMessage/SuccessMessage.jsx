import React, { Component } from 'react';
import propTypes from 'prop-types';

/**
 * IntroMessage class
 */
class SuccessMessage extends Component {

  /**
   * Render the SuccessMessage
   * @return {XML}
   */
  render() {
    return (
        <p>heres the SuccessMessage copy</p>
    );
  }
}

SuccessMessage.propTypes = {
  history: propTypes.shape({
    push: propTypes.func,
  }),
};

SuccessMessage.defaultProps = {
  history: { push: null },
};

export default SuccessMessage;
