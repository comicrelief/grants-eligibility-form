/* eslint-env browser */
import React, { Component } from 'react';
import propTypes from 'prop-types';
import Questions from './templates/questions.json';

const ReactMarkdown = require('react-markdown');

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
      responses: {}, // eslint-disable-line react/no-unused-state
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
  updatePath(inputState) {
    const currentQuestion = parseInt(this.state.currentQuestion, 10);
    const nextQuestion = currentQuestion + 1;

    if (currentQuestion >= this.state.totalQuestions) {
      this.props.history.push({
        pathname: /outcome/,
        state: {
          responses: inputState.responses,
          snippets: inputState.snippets,
          successes: inputState.successes,
        },
      });
    } else {
      this.props.history.push({
        pathname: '/question/' + nextQuestion,
      });
    }
  }

  /* Handles 'submission' of the company input question */
  handleTextSubmit(e) {
    e.preventDefault();

    const stateCopy = Object.assign({}, this.state);
    stateCopy.success = true;

    /* Pass this as a 'success' as there's no fail criteria for this step */
    stateCopy.successes = (this.state.successes).concat('yes');
    this.setState(stateCopy);

    this.updatePath();
  }

  /* Allows the user to step back one question by updating the path
     which, in turn, updates the currentQuestion number in updateQuestionNumber func */
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

    /* Convert string to array, if there's multiple snippets */
    theseSnippets = theseSnippets.split(',');

    /* Store the user's response to the question */
    const stateCopy = Object.assign({}, this.state);
    stateCopy.responses[thisQuestionType] = thisValue;
    stateCopy.snippets = (this.state.snippets).concat(theseSnippets);
    stateCopy.successes = (this.state.successes).concat(thisValue);
    this.setState(stateCopy);

    /* Update the URL, passing our newly update state copy, so it'll work before a state update */
    this.updatePath(stateCopy);
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
  renderTextInput() {
    const currentInput = Questions['q' + this.state.currentQuestion].text_input;

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
    const currentButtons = Questions['q' + this.state.currentQuestion].buttons;

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
    const currentQuestionPointer = 'q' + this.state.currentQuestion;

    return (
      <div>
        { Questions[currentQuestionPointer].title !== undefined ?
          <header className="bg--red promo-header promo-header--default promo-header--no-image">
            <div className="promo-header__content">
              <div className="promo-header__content-inner promo-header__content-inner--centre">
                <div className="cr-body">
                  <h1 className="font--white text-align-center">
                    <ReactMarkdown
                      source={Questions[currentQuestionPointer].title}
                      className="text-align-center font--family-bold"
                    />
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

                      <ReactMarkdown
                        source={Questions[currentQuestionPointer].copy}
                        className="text-align-center font--family-bold"
                      />

                      { this.renderTextInput() }
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
};

Question.defaultProps = {
  resize() { },
  match: null,
  history: { push: null },
};

export default Question;
