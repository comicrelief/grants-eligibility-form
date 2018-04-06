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
import q9 from './templates/q9.html';

/**
 * Question class
 */
class Question extends Component {
  /* Helper function to help contain messy message logic */
  static messageSwitch(currentQuestionType, value, coreCosts, over100k) {
    switch (currentQuestionType) {
      case 'sports-project':
        if (coreCosts === 'no') { return '6'; } else if (coreCosts === 'yes') { return (over100k === 'yes' ? '4' : '5'); }
        break;

      case 'project-location':
        if (value === 'somewhere-else') {
          if (coreCosts === 'no') { return '7'; } else if (coreCosts === 'yes') { return (over100k === 'yes' ? '8' : '9'); }
        } else if (value === 'india-etc') {
          if (coreCosts === 'no') { return '10'; } else if (coreCosts === 'yes') { return (over100k === 'yes' ? '11' : '12'); }
        } break;

      case 'london':
        if (value === 'no') {
          if (coreCosts === 'no') { return '10'; } else if (coreCosts === 'yes') { return (over100k === 'yes' ? '11' : '12'); }
        } else if (value === 'yes') {
          if (coreCosts === 'no') { return '13'; } else if (coreCosts === 'yes') { return (over100k === 'yes' ? '14' : '15'); }
        } break;

      default:
        return 'default';
    }
    return 'error';
  }
  /**
   * Question constructor
   * @param props
   */
  constructor(props) {
    super(props);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.submitAnswer = this.submitAnswer.bind(this);
    this.previousQuestion = this.previousQuestion.bind(this);

    this.state = {
      currentQuestion: 1,
      totalQuestions: 9,
      responses: {},
    };
  }

  componentDidMount() {
    this.updateQuestionNumber();
    this.sendFormHeightMessage();
  }

  componentDidUpdate() {
    this.updateQuestionNumber();
    this.sendFormHeightMessage();
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

  /* Handles 'submission' of the company input question */
  handleSubmit(event) {
    event.preventDefault();
    /* Create path to next question */
    const nextQuestion = parseInt(this.state.currentQuestion, 10) + 1;
    const newPath = '/question/' + nextQuestion;

    /* Update the URL */
    this.props.history.push({ pathname: newPath });
  }

  /* Allows the user to step back one question by updating the path
  * which, in turn, updates the currentQuestion number in updateQuestionNumber func  */
  previousQuestion() {
    const newPath = '/question/' + (this.state.currentQuestion - 1);

    this.props.history.push({ pathname: newPath });
  }

  /* Handles submission of each question, storing the response and switching content as required */
  submitAnswer(e) {
    /* Get this response's attrs and values */
    const thisButton = e.target;
    const isRejected = thisButton.getAttribute('data-r');
    const thisValue = thisButton.getAttribute('data-v');
    const thisQuestionType = thisButton.getAttribute('data-q');
    const theseResponses = this.state.responses;

    /* Cache current question to use as array pointer */
    const thisQuestion = this.state.currentQuestion;

    /* Store the user's response to the question */
    const stateCopy = Object.assign({}, this.state);
    stateCopy.responses[thisQuestionType] = thisValue;

    let newPath = '';

    /* If this answer still represents an eligable submission, continue the journey */
    if (isRejected === 'false') {
      newPath = '/question/' + (thisQuestion + 1);
      stateCopy.responses.success = true;
    } else if (isRejected === 'true') {
      /* If this answer is a direct rejection, forward user
       * to the rejection page with specific variant  */
      newPath = '/outcome/' + thisButton.getAttribute('data-m');
      stateCopy.responses.success = false;
    } else {
      /* Else, this is our "check" value, and we need to
       * check prior answers to determine the outcome */
      const messageToShow = Question.messageSwitch(thisQuestionType, thisValue, theseResponses['core-costs'], theseResponses['over-100k']);

      newPath = '/outcome/' + messageToShow;

      /* IE-friendly alternative to 'includes';
       * set our 'success' flag based on the rejection message numbers */
      let arr = ['1', '2', '3', '4', '6', '7', '8'];

      arr = arr.map(i => '^' + i + '$').join('|');

      const isRejection = new RegExp(arr).test(messageToShow);

      // Flip the boolean value to represent success equivalent
      stateCopy.responses.success = !isRejection;
    }

    /* Update the URL */
    this.props.history.push({
      pathname: newPath,
      state: {
        responses: theseResponses,
      },
    });
  }

  /**
   * Send form height message to parent iframe.
   */
  sendFormHeightMessage() {
    const formHeight = document.getElementById('grants-form') !== null
      ? document.getElementById('grants-form').clientHeight
      : '1000';

    setTimeout(function () {
      window.parent.postMessage('{"iframe_height":"' + formHeight + '"}', '*');
    }, 250);
  }

  progressClassNames(stepNum, currentQ) {
    if (stepNum < currentQ) {
      return 'progress-indicator--done';
    } else if (stepNum === currentQ) {
      return 'progress-indicator--active';
    } return 'progress-indicator--todo';
  }

  renderProgress() {
    const currQ = this.state.currentQuestion;
    const total = this.state.totalQuestions;

    return (
      <ul className={'progress-indicator progress-indicator__steps-' + total}>

        <li className={'step-2 ' + this.progressClassNames(2, currQ)}>
          <span className="progress-indicator__step-link">
            <span className="progress-indicator__step progress-indicator__circle" />
            <span className="progress-bar__title">About</span>
          </span>
        </li>
        <li className={'no-circle step-3 ' + this.progressClassNames(3, currQ)}>
          <span className="progress-indicator__step-link">
            <span className="progress-indicator__step progress-indicator__circle" />
          </span>
        </li>
        <li className={'no-circle step-4 ' + this.progressClassNames(4, currQ)}>
          <span className="progress-indicator__step-link">
            <span className="progress-indicator__step progress-indicator__circle" />
          </span>
        </li>
        <li className={'step-5 ' + this.progressClassNames(5, currQ)}>
          <span className="progress-indicator__step-link">
            <span className="progress-indicator__step progress-indicator__circle" />
            <span className="progress-bar__title">Finance</span>
          </span>
        </li>
        <li className={'no-circle step-6 ' + this.progressClassNames(6, currQ)}>
          <span className="progress-indicator__step-link">
            <span className="progress-indicator__step progress-indicator__circle" />
          </span>
        </li>
        {/* To keep the question numbers balanced and avoid having to totally rework styles */}
        <li className={'no-circle step-6.5 ' + this.progressClassNames(6.5, currQ)}>
          <span className="progress-indicator__step-link">
            <span className="progress-indicator__step progress-indicator__circle" />
          </span>
        </li>
        <li className={'step-7 ' + this.progressClassNames(7, currQ)}>
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
        <form onSubmit={this.handleSubmit}>
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
              className={'grants-btn btn btn-' + (index + 1)}
              onClick={this.submitAnswer}
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
      value: propTypes.string,
      reject: propTypes.string,
      message: propTypes.string,
    })),
    buttons: propTypes.arrayOf(propTypes.shape({
      question_type: propTypes.string,
      text: propTypes.string,
      value: propTypes.string,
      reject: propTypes.string,
      message: propTypes.string,
    })),
  })),
};

Question.defaultProps = {
  match: null,
  history: { push: null },
  questions: [
    {
      template: q1,
      title: 'Get started',
      buttons: [
        {
          question_type: 'organisation-type', text: 'Individual', value: 'individual', reject: 'true', message: '1',
        },
        {
          question_type: 'organisation-type', text: 'Organisation', value: 'organisation', reject: 'false', message: '',
        }],
    },
    {
      template: q2,
      text_input: [{
        question_type: 'organisation-name', text: 'Your organisation name', value: '', reject: 'false', message: '',
      }],

    },
    {
      template: q3,
      buttons: [
        {
          question_type: 'activities-type', text: 'Yes', value: 'yes', reject: 'true', message: '2',
        },
        {
          question_type: 'activities-type', text: 'No', value: 'no', reject: 'false', message: '',
        }],
    },
    {
      template: q4,
      buttons: [
        {
          question_type: 'capital-costs', text: 'Yes', value: 'yes', reject: 'true', message: '3',
        },
        {
          question_type: 'capital-costs', text: 'No', value: 'no', reject: 'false', message: '',
        }],
    },
    {
      template: q5,
      buttons: [
        {
          question_type: 'core-costs', text: 'Yes', value: 'yes', reject: 'false', message: '',
        },
        {
          question_type: 'core-costs', text: 'No', value: 'no', reject: 'false', message: '',
        }],
    },
    {
      template: q6,
      buttons: [
        {
          question_type: 'over-100k', text: 'Yes', value: 'yes', reject: 'false', message: '',
        },
        {
          question_type: 'over-100k', text: 'No', value: 'no', reject: 'false', message: '',
        }],
    },
    {
      template: q7,
      buttons: [
        {
          question_type: 'sports-project', text: 'Yes', value: 'yes', reject: 'false', message: '',
        },
        {
          question_type: 'sports-project', text: 'No', value: 'no', reject: 'check', message: '',
        }],
    },
    {
      template: q8,
      buttons: [
        {
          question_type: 'project-location', text: 'United Kingdom', value: 'uk', reject: 'false', message: '',
        },
        {
          question_type: 'project-location', text: 'India, South Africa, Brazil or Kenya', value: 'india-etc', reject: 'check', message: '',
        },
        {
          question_type: 'project-location', text: 'Somewhere else', value: 'somewhere-else', reject: 'check', message: '',
        }],
    },
    {
      template: q9,
      buttons: [
        {
          question_type: 'london', text: 'Yes', value: 'yes', reject: 'check', message: '',
        },
        {
          question_type: 'london', text: 'No', value: 'no', reject: 'check', message: '',
        }],
    },
  ],
};

export default Question;
