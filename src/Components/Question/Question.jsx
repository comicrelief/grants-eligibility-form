import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';
import Parser from 'html-react-parser';

/**
 * IntroMessage class
 */
class Question extends Component {

 static defaultProps = {
    questions: [
      { copy: "<p>Q1 copy</p>", options: "<a class='btn btn--red'>Q1 btn</a><a class='btn btn--red'>Q1 btn2</a>" },
      { copy: "<p>Q2 copy</p>", options: "<a class='btn btn--red'>Q2 btn</a><a class='btn btn--red'>Q2 btn2</a>" },
      { copy: "<p>Q3 copy</p>", options: "<a class='btn btn--red'>Q3 btn</a><a class='btn btn--red'>Q3 btn2</a>" },
      { copy: "<p>Q4 copy</p>", options: "<a class='btn btn--red'>Q4 btn</a><a class='btn btn--red'>Q4 btn2</a>" },
      { copy: "<p>Q5 copy</p>", options: "<a class='btn btn--red'>Q5 btn</a><a class='btn btn--red'>Q5 btn2</a>" },
      { copy: "<p>Q6 copy</p>", options: "<a class='btn btn--red'>Q6 btn</a><a class='btn btn--red'>Q6 btn2</a>" },
      { copy: "<p>Q7 copy</p>", options: "<a class='btn btn--red'>Q7 btn</a><a class='btn btn--red'>Q7 btn2</a>" },
      { copy: "<p>Q8 copy</p>", options: "<a class='btn btn--red'>Q8 btn</a><a class='btn btn--red'>Q8 btn2</a>" },
      { copy: "<p>Q9 copy</p>", options: "<a class='btn btn--red'>Q9 btn</a><a class='btn btn--red'>Q9 btn2</a>" },
    ]
  };

  /**
   * Render the Question
   * @return {XML}
   */
  render() {

    let currentCopy = this.props.questions[0]['copy'];
    let currentOptions = this.props.questions[0]['options'];

    return (
        <div>
          {Parser( currentCopy )}
          {Parser( currentOptions )}
        </div>
    );
  }
}

/* Define proptypes */
Question.PropTypes = {
  questions: PropTypes.arrayOf(PropTypes.shape({
    copy: PropTypes.string.isRequired,
    options: PropTypes.string.isRequired,
  })).isRequired,};

export default Question;
