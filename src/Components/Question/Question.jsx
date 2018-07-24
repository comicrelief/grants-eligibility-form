/* eslint-env browser */
import React, { Component } from 'react';
import propTypes from 'prop-types';
import Parser from 'html-react-parser';

// Import all of our template variants
import q1 from './templates/q1.html';
import q2 from './templates/q2.html';
import q3 from './templates/q3.html';
import q4 from './templates/q4.html';
import q5 from './templates/q5.html';
import q6 from './templates/q6.html';
import q7 from './templates/q7.html';
import q8 from './templates/q8.html';

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
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleTextSubmit = this.handleTextSubmit.bind(this);
    this.handleButtonChoice = this.handleButtonChoice.bind(this);
    this.previousQuestion = this.previousQuestion.bind(this);
    this.updatePath = this.updatePath.bind(this);

    this.state = {
      currentQuestion: 1,
      totalQuestions: 8,
      snippets: [],
      successes: [],
      responses: {},
      // success: false,
    };
  }

  componentDidMount() {
    this.updateQuestionNumber();
    this.props.resize();
  }

  componentDidUpdate() {
    this.updateQuestionNumber();
    this.props.resize();
  }

  /* Update the state to reflect our input field */
  handleTextChange(event) {
    const stateCopy = Object.assign({}, this.state);
    stateCopy.responses.company_name = event.target.value;
    this.setState(stateCopy);
  }

  /* Update the state to reflect our current question */
  updateQuestionNumber() {
    const currUrlQ = parseInt(this.props.match.params.question_number, 10);
    if (this.state.currentQuestion !== currUrlQ) {
      this.setState({ currentQuestion: currUrlQ });
    }
  }

  /* Update path to next question or outcome messaging */
  updatePath() {
    const nextQuestion = parseInt(this.state.currentQuestion, 10) + 1;

    if (nextQuestion > this.state.totalQuestions) {
      console.log('any fails?', this.state);

      this.props.history.push({
        pathname: /outcome/,
        state: {
          responses: this.state.responses,
          snippets: this.state.snippets,
          successes: this.state.successes,
        },
      });
    } else {
      this.props.history.push({
        pathname: '/question/' + nextQuestion,
      });
    }
  }

  /* Handles 'submission' of the company input question */
  handleTextSubmit(event) {
    event.preventDefault();

    const stateCopy = Object.assign({}, this.state);
    stateCopy.success = true;
    /* Pass this as a 'success' as there's no fail criteria for this step */
    stateCopy.successes = (this.state.successes).concat('yes');
    this.setState(stateCopy);

    this.updatePath();
  }

  /* Allows the user to step back one question by updating the path
  * which, in turn, updates the currentQuestion number in updateQuestionNumber func  */
  previousQuestion() {
    const newPath = '/question/' + (this.state.currentQuestion - 1);
    this.props.history.push({ pathname: newPath });
  }

  /* Handles submission of each question, storing the response and switching content as required */
  handleButtonChoice(e) {
    /* Get this response's attrs and values */
    const thisButton = e.target;
    const thisValue = thisButton.getAttribute('data-v');
    const thisQuestionType = thisButton.getAttribute('data-q');
    let theseSnippets = thisButton.getAttribute('data-s');
    // Convert string to array
    theseSnippets = theseSnippets.split(',');

    const theseResponses = this.state.responses;

    /* Cache current question to use as array pointer */
    // const thisQuestion = this.state.currentQuestion;

    /* Store the user's response to the question */
    const stateCopy = Object.assign({}, this.state);
    stateCopy.responses[thisQuestionType] = thisValue;
    stateCopy.snippets = (this.state.snippets).concat(theseSnippets);
    stateCopy.successes = (this.state.successes).concat(thisValue);

    this.setState(stateCopy);

    /* Update the URL */
    this.props.history.push({
      state: {
        responses: theseResponses,
      },
    });

    this.updatePath();
  }

  progressClassNames(stepNum, currentQ) {
    if (stepNum < currentQ) {
      return 'done';
    } else if (stepNum === currentQ) {
      return 'active';
    } return 'todo';
  }

  renderProgress() {
    const currQ = this.state.currentQuestion;
    const total = this.state.totalQuestions;

    return (
      <ul className={'progress-indicator progress-indicator__steps-' + total}>

        <li className={'step-2 progress-indicator--' + this.progressClassNames(2, currQ)}>
          <span className="progress-indicator__step-link">
            <span className="progress-indicator__step progress-indicator__circle" />
            <span className="progress-bar__title">About</span>
          </span>
        </li>
        <li className={'no-circle step-3 progress-indicator--' + this.progressClassNames(3, currQ)}>
          <span className="progress-indicator__step-link">
            <span className="progress-indicator__step progress-indicator__circle" />
          </span>
        </li>
        <li className={'no-circle step-4 progress-indicator--' + this.progressClassNames(4, currQ)}>
          <span className="progress-indicator__step-link">
            <span className="progress-indicator__step progress-indicator__circle" />
          </span>
        </li>
        <li className={'step-5 progress-indicator--' + this.progressClassNames(5, currQ)}>
          <span className="progress-indicator__step-link">
            <span className="progress-indicator__step progress-indicator__circle" />
            <span className="progress-bar__title">Finance</span>
          </span>
        </li>
        <li className={'no-circle step-6 progress-indicator--' + this.progressClassNames(6, currQ)}>
          <span className="progress-indicator__step-link">
            <span className="progress-indicator__step progress-indicator__circle" />
          </span>
        </li>
        {/* To keep the question numbers balanced and avoid having to totally rework styles */}
        <li className={'no-circle step-6.5 progress-indicator--' + this.progressClassNames(6.5, currQ)}>
          <span className="progress-indicator__step-link">
            <span className="progress-indicator__step progress-indicator__circle" />
          </span>
        </li>
        <li className={'step-7 progress-indicator--' + this.progressClassNames(7, currQ)}>
          <span className="progress-indicator__step-link">
            <span className="progress-indicator__step progress-indicator__circle" />
            <span className="progress-bar__title">Project</span>
          </span>
        </li>
      </ul>
    );
  }

  /**
   * Render the user choices for this specific questions
   * @return {XML}
   */
  renderInput() {
    /* Access our zero-indexed question array */
    const currentInput = this.props.questions[this.state.currentQuestion - 1].text_input;

    if (currentInput !== undefined) {
      return (
        <form onSubmit={this.handleTextSubmit}>
          {currentInput.map(thisInput => (
            <div key={thisInput.question_type + 'wrapper'} className="field-item text-input text-align-center">
              <label htmlFor={thisInput.question_type + '__input'} key={thisInput.question_type + '__label'}>{thisInput.text}</label>
              <input
                id={thisInput.question_type + '__input'}
                placeholder={thisInput.text}
                required
                key={thisInput.question_type + '__input'}
                type="text"
                onChange={this.handleTextChange}
                className={thisInput.question_type + '__input'}
                maxLength="200"
              />
              <input
                type="submit"
                value="Continue"
                className={thisInput.question_type + '__submit'}
              />
            </div>
            ))}
        </form>
      );
    }
    return null;
  }

  /**
   * Render the user choices for this specific questions
   * @return {XML}
   */
  renderButtons() {
    /* Access our zero-indexed question array */
    const currentButtons = this.props.questions[this.state.currentQuestion - 1].buttons;

    if (currentButtons !== undefined) {
      return (
        <div className="buttons text-align-center">
          {currentButtons.map((thisButton, index) => (
            <button
              key={thisButton.question_type + '-' + thisButton.text}
              data-q={thisButton.question_type}
              data-v={thisButton.value}
              data-r={thisButton.reject}
              data-m={thisButton.message}
              data-s={thisButton.snippets}
              className={'grants-btn btn btn-' + (index + 1)}
              onClick={this.handleButtonChoice}
            >
              {thisButton.text}
            </button>
            ))}
        </div>
      );
    } return null;
  }

  /**
   * Render the user choices for this specific questions
   * @return {XML}
   */
  renderPreviousButton() {
    return (
      <p>
        <button
          key={'back-to-question-' + this.state.currentQuestion}
          className="link-dark-purple link previous-question"
          onClick={this.previousQuestion}
        >
          Go back to previous question
        </button>
      </p>
    );
  }

  /**
   * Render the Question
   * @return {XML}
   */
  render() {
    // Cache the current copy and user options from our zero-indexed array
    const currentQuestion = this.props.questions[this.state.currentQuestion - 1];

    return (
      <div>
        { currentQuestion.title !== undefined ?
          <header className="bg--red promo-header promo-header--default promo-header--no-image">
            <div className="promo-header__content">
              <div className="promo-header__content-inner promo-header__content-inner--centre">
                <div className="cr-body">
                  <h1 className="font--white text-align-center">
                    { Parser(currentQuestion.title) }
                  </h1>
                </div>
              </div>
            </div>
          </header> :

          <header className="bg--white promo-header promo-header--default promo-header--no-image">
            <div className="promo-header__content">
              <div className="promo-header__content-inner promo-header__content-inner--centre">
                <div className="cr-body">
                  { this.renderProgress() }
                  { this.renderPreviousButton() }
                </div>
              </div>
            </div>
          </header>
      }
        <main role="main" className="bg--grey">
          <section className={'paragraph single-msg single-msg--copy-only bg--white bg--grey question question-' + this.state.currentQuestion}>
            <div className="single-msg__outer-wrapper">
              <div className="single-msg__copy_wrapper bg--white">
                <div className="single-msg__copy">
                  <div className="single-msg__body">
                    <div className="cr-body">
                      { Parser(currentQuestion.template) }
                      { this.renderInput() }
                      { this.renderButtons() }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }
}

/* Define proptypes */
Question.propTypes = {
  resize: propTypes.func,
  history: propTypes.shape({
    push: propTypes.func,
  }),
  match: propTypes.shape({
    params: propTypes.shape({
      question_number: propTypes.string,
    }),
  }),
  questions: propTypes.arrayOf(propTypes.shape({
    title: propTypes.string,
    template: propTypes.string,
    text_input: propTypes.arrayOf(propTypes.shape({
      question_type: propTypes.string,
      text: propTypes.string,
      message: propTypes.string,
    })),
    buttons: propTypes.arrayOf(propTypes.shape({
      question_type: propTypes.string,
      text: propTypes.string,
      value: propTypes.string,
      snippets: propTypes.array,
    })),
  })),
};

Question.defaultProps = {
  resize() { },
  match: null,
  history: { push: null },
  questions: [
    {
      template: q1,
      title: 'Get started',
      buttons: [
        {
          question_type: 'question-1', text: 'q1 yes', value: 'yes', snippets: ['q1-yes'],
        },
        {
          question_type: 'question-1', text: 'q1 no', value: 'no', snippets: ['q1-no'],
        }],
    },
    {
      template: q2,
      text_input: [{
        question_type: 'question-2', text: 'q2 input', value: '', snippets: ['q2-yes'],
      }],

    },
    {
      template: q3,
      buttons: [
        {
          question_type: 'question-3', text: 'q3 yes', value: 'yes', snippets: ['q3-yes'],
        },
        {
          question_type: 'question-3', text: 'q3 no', value: 'no', snippets: ['q3-no'],
        }],
    },
    {
      template: q4,
      buttons: [
        {
          question_type: 'question-4', text: 'q4 yes', value: 'yes', snippets: ['q4-yes'],
        },
        {
          question_type: 'question-4', text: 'q4 no', value: 'no', snippets: ['q4-no'],
        }],
    },
    {
      template: q5,
      buttons: [
        {
          question_type: 'question-5', text: 'q5 yes', value: 'yes', snippets: ['q5-yes'],
        },
        {
          question_type: 'question-5', text: 'q5 no', value: 'no', snippets: ['q5-no'],
        }],
    },
    {
      template: q6,
      buttons: [
        {
          question_type: 'question-6', text: 'q6 yes', value: 'yes', snippets: ['q6-yes'],
        },
        {
          question_type: 'question-6', text: 'q6 no', value: 'no', snippets: ['q6-no'],
        }],
    },
    {
      template: q7,
      buttons: [
        {
          question_type: 'question-7', text: 'q7 yes', value: 'yes', snippets: ['q7-yes'],
        },
        {
          question_type: 'question-7', text: 'q7 no', value: 'no', snippets: ['q7-no'],
        }],
    },
    {
      template: q8,
      buttons: [
        {
          question_type: 'question-8', text: 'q8 yes', value: 'yes', snippets: ['q8-yes'],
        },
        {
          question_type: 'question-8', text: 'q8 no', value: 'no', snippets: ['q8-no'],
        }],
    },
  ],
};

export default Question;
