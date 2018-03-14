import React, { Component } from 'react';
import propTypes from 'prop-types';
import DOMPurify from 'dompurify';
import Parser from 'html-react-parser';

/**
 * IntroMessage class
 */
class Question extends Component {

 static defaultProps = {
    questions: [
      {
        copy: "<p> 1: What type of organisation? </p>",
        buttons: [
          { text: "q1: ineligible", link: "/NOPE" },
          { text: "next question", link: "/question/2" }
        ]
      },
            {
        copy: "<p>Question 2</p>",
        buttons: [
          { text: "q2: ineligible", link: "/rejection" },
          { text: "next question", link: "/question/3" }
        ]
      },
            {
        copy: "<p>Question 3</p>",
        buttons: [
          { text: "q3: ineligible", link: "/rejection" },
          { text: "next question", link: "/question/4" }
        ]
      },
    ]
  };

  /**
   * Render the user choices for this specific questions
   * @return {XML}
   */
  renderButtons() {

    // Access our zero-indexed (hence -1) question array
    let currentButtons = this.props.questions[this.props.current_question-1]['buttons'];

    return (
      <p>
        {currentButtons.map(function(thisOption,index){
          return ( <a key={index} className='btn btn--red' href={thisOption.link} onClick={ this.props.nextQuestion } > {thisOption.text} </a> )
        }.bind(this))}
      </p>
    );
  }

  testo(){
    console.log("testo!");
  }

  /**
   * Render the Question
   * @return {XML}
   */
  render() {
    // Cache the current copy and user options from our zero-indexed array
    let currentCopy = this.props.questions[this.props.current_question-1]['copy'];
    return (
        <div>
          {Parser( currentCopy )}
          { this.renderButtons() }
        </div>
    );
  }
}

/* Define proptypes */
Question.propTypes = {
  nextQuestion: propTypes.func.isRequired,
  questions: propTypes.arrayOf(propTypes.shape({
    copy: propTypes.string.isRequired,
    buttons: propTypes.array.isRequired,
  })).isRequired,};

export default Question;
