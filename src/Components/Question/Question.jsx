import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * IntroMessage class
 */
class Question extends Component {

  constructor(props) {
    super(props);
  }

  /**
   * Render the form
   * @return {XML}
   */
  render() {
    return (
        <div>
          <p>heres the Question copy</p>
        </div>
    );
  }
}

Question.propTypes = {
  currentQuestion: PropTypes.number,
};

Question.defaultProps = {
  currentQuestion: 0,
};

export default Question;
