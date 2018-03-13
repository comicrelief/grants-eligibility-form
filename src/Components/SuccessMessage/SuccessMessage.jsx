import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * IntroMessage class
 */
class SuccessMessage extends Component {

  constructor(props) {
    super(props);
  }

  /**
   * Render the form
   * @return {XML}
   */
  render() {
    return (
        <p>heres the SuccessMessage copy</p>
    );
  }
}

SuccessMessage.propTypes = {
  currentQuestion: PropTypes.number,
};

SuccessMessage.defaultProps = {
  currentQuestion: 0,
};

export default SuccessMessage;
