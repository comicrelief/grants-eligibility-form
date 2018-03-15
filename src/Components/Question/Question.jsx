import React, { Component } from 'react';
import propTypes from 'prop-types';
import Parser from 'html-react-parser';

/**
 * Question class
 */
class Question extends Component {

  /**
   * Question constructor
   * @param props
   */
   constructor(props) {
      super(props);

      this.state = {
        currentQuestion: 1,
        responses: {},
      }
    }

  static defaultProps = {
    questions: [
      {
        copy: "<p>1: What type of organisation?</p>",
        buttons: [{ text: "Individual", eligible: false}, { text: "Charity", eligible: true }]
      },
      {
        copy: "<p>2: Organisation name: 2</p>",
        buttons: [{ text: "TEXTFIELD TO COME", eligible: true}]
      },
      {
        copy: "<p>3: What activities?</p>",
        buttons: [{ text: "Religious", eligible: false}, {text: "Other", eligible: true}]
      },
      {
        copy: "<p>4: Only looking to cover capital costs?</p>",
        buttons: [{ text: "Yes", eligible: false}, {text: "No", eligible: true}]
      },
      {
        copy: "<p>5: Core costs?</p>",
        buttons: [{ text: "Yes", eligible: false}, {text: "No", eligible: true}]
      },
    ]
  };

  /**
   * Render the user choices for this specific questions
   * @return {XML}
   */
  renderButtons() {

    /* Access our zero-indexed question array */
    let currentButtons = this.props.questions[this.state.currentQuestion - 1]['buttons'];

    return (
      <div className="buttons">
        {currentButtons.map(function(thisButton,index){
          return (
            <p key={index}>
              <a key={index} data-e={thisButton.eligible} className='btn btn--red' onClick={function(e){this.submitAnswer(e);}.bind(this)}>
                {thisButton.text}
              </a>
            </p>
          )
        }.bind(this))}
      </div>
    );
  }

  /* Handles submission of each question, storing the response and switching content as required */
  submitAnswer(e) {

    // Get the button's value, update the form state
    let thisResponse = e.target.getAttribute("data-e");
    let thisQuestion = this.state.currentQuestion;
    let newPath = "";

    // Store the response 
    let stateCopy = Object.assign({}, this.state);
    stateCopy.responses[thisQuestion] = thisResponse;
    stateCopy.currentQuestion = thisQuestion+1;
    this.setState(stateCopy);

    /* If this answer still represents an eligable submission, continue the journey */
    if (thisResponse === 'true') {
      newPath = `/question/` + (thisQuestion+1);
    } 

    else {
      // TODO: pass rejection type to RejectionMessage comp to switch content dynamically
      newPath = `/rejection/`;
    }

    /* Update the URL */
    this.props.history.push({
      pathname: newPath,
    });
  }

  /**
   * Render the Question
   * @return {XML}
   */
  render() {
    // Cache the current copy and user options from our zero-indexed array
    let currentCopy = this.props.questions[this.state.currentQuestion - 1]['copy'];

    return (
        <div className={'question question-' + this.state.currentQuestion}>
          { Parser(currentCopy) }
          { this.renderButtons() }
        </div>
    );
  }
}

/* Define proptypes */
Question.propTypes = {
  questions: propTypes.arrayOf(propTypes.shape({
    copy: propTypes.string.isRequired,
    buttons: propTypes.array.isRequired,
  })).isRequired,};

export default Question;
