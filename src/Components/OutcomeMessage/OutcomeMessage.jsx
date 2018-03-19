import React, { Component } from 'react';
import propTypes from 'prop-types';

/**
 * OutcomeMessage class
 */
class OutcomeMessage extends Component {

  /**
   * Render the OutcomeMessage
   * @return {XML}
   */
  render() {
    return (
        <p>heres the default OutcomeMessage copy</p>
    );
  }
}

OutcomeMessage.propTypes = {
  history: propTypes.shape({
    push: propTypes.func,
  }),
};

OutcomeMessage.defaultProps = {
  history: { push: null },
};

export default OutcomeMessage;
